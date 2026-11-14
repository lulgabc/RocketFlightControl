export {};

/* ============================================================
   Toolkit: delta-v, ISA atmosphere, single-axis PID simulator
   All computation stays in the browser.
   ============================================================ */

const $ = <T extends Element = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);

const numberFrom = (id: string, fallback = 0): number => {
  const input = document.getElementById(id) as HTMLInputElement | null;
  const value = input ? Number.parseFloat(input.value) : Number.NaN;
  return Number.isFinite(value) ? value : fallback;
};

const setText = (selector: string, value: string) => {
  const node = $(selector);
  if (node) node.textContent = value;
};

/* ---------------- Delta-v ---------------- */

const G0 = 9.80665;

const updateDeltaV = () => {
  const isp = numberFrom("dv-isp");
  const m0 = numberFrom("dv-m0");
  const prop = numberFrom("dv-prop");
  const mf = m0 - prop;
  const ve = isp * G0;

  if (!(isp > 0) || !(m0 > 0) || !(prop > 0) || !(mf > 0)) {
    for (const key of ["mf", "ratio", "ve", "dv", "frac", "leo"]) {
      setText(`[data-dv="${key}"]`, "—");
    }
    return;
  }

  const ratio = m0 / mf;
  const dv = ve * Math.log(ratio);
  const leoRatio = Math.exp(9400 / ve);

  setText('[data-dv="mf"]', `${mf.toFixed(1)} kg`);
  setText('[data-dv="ratio"]', ratio.toFixed(2));
  setText('[data-dv="ve"]', `${ve.toFixed(0)} m/s`);
  setText('[data-dv="dv"]', `${dv.toFixed(0)} m/s`);
  setText('[data-dv="frac"]', `${((prop / m0) * 100).toFixed(0)} %`);
  setText(
    '[data-dv="leo"]',
    Number.isFinite(leoRatio) ? `${leoRatio.toFixed(2)}` : "—",
  );
};

for (const id of ["dv-isp", "dv-m0", "dv-prop"]) {
  document.getElementById(id)?.addEventListener("input", updateDeltaV);
}
updateDeltaV();

/* ---------------- ISA atmosphere ---------------- */

interface Atmosphere {
  temperature: number;
  pressure: number;
  density: number;
  soundSpeed: number;
}

const isaAtmosphere = (altitude: number): Atmosphere => {
  const h = Math.min(84852, Math.max(0, altitude));
  const g = 9.80665;
  const R = 287.05287;
  const gamma = 1.4;

  let T: number;
  let p: number;

  if (h <= 11000) {
    T = 288.15 - 0.0065 * h;
    p = 101325 * Math.pow(T / 288.15, 5.25588);
  } else if (h <= 20000) {
    T = 216.65;
    p = 22632.06 * Math.exp((-g * (h - 11000)) / (R * T));
  } else if (h <= 32000) {
    T = 216.65 + 0.001 * (h - 20000);
    p = 5474.89 * Math.pow(T / 216.65, -34.1632);
  } else if (h <= 47000) {
    T = 228.65 + 0.0028 * (h - 32000);
    p = 868.0187 * Math.pow(T / 228.65, -12.2011);
  } else if (h <= 51000) {
    T = 270.65;
    p = 110.9063 * Math.exp((-g * (h - 47000)) / (R * T));
  } else if (h <= 71000) {
    T = 270.65 - 0.0028 * (h - 51000);
    p = 66.93887 * Math.pow(T / 270.65, 12.2011);
  } else {
    T = 214.65 - 0.002 * (h - 71000);
    p = 3.95642 * Math.exp((-g * (h - 71000)) / (R * T));
  }

  const density = p / (R * T);
  return { temperature: T, pressure: p, density, soundSpeed: Math.sqrt(gamma * R * T) };
};

const updateAtmosphere = () => {
  const altitude = numberFrom("at-alt");
  const velocity = Math.max(0, numberFrom("at-vel"));
  const atm = isaAtmosphere(altitude);

  const q = 0.5 * atm.density * velocity * velocity;
  const mach = velocity / atm.soundSpeed;

  setText('[data-at="t"]', `${(atm.temperature - 273.15).toFixed(1)} °C`);
  setText('[data-at="p"]', `${(atm.pressure / 1000).toFixed(2)} kPa`);
  setText('[data-at="rho"]', `${atm.density.toFixed(3)} kg/m³`);
  setText('[data-at="a"]', `${atm.soundSpeed.toFixed(0)} m/s`);
  setText('[data-at="q"]', `${(q / 1000).toFixed(1)} kPa`);
  setText('[data-at="mach"]', Number.isFinite(mach) ? mach.toFixed(2) : "—");
};

for (const id of ["at-alt", "at-vel"]) {
  document.getElementById(id)?.addEventListener("input", updateAtmosphere);
}
updateAtmosphere();

/* ---------------- PID simulator ---------------- */

const canvas = $<HTMLCanvasElement>("[data-pid-canvas]");
const context = canvas?.getContext("2d") ?? null;

interface Sample {
  t: number;
  theta: number;
  target: number;
  tau: number;
}

interface PidState {
  t: number;
  theta: number;
  omega: number;
  tau: number;
  integral: number;
  saturatedTime: number;
  samples: Sample[];
  lastSample: number;
}

const DT = 0.005;
const STEP_TIME = 1;
const WINDOW = 12;
const SERVO_TAU = 0.04;
const INERTIA = 1;
const DAMPING = 0.15;
const DISTURBANCE = 0.05;
const INTEGRAL_SEPARATION = 0.12; // rad, ~6.9°

const makeState = (): PidState => ({
  t: 0,
  theta: 0,
  omega: 0,
  tau: 0,
  integral: 0,
  saturatedTime: 0,
  samples: [],
  lastSample: -1,
});

let state = makeState();
let running = true;
let lastFrame = 0;
let accumulated = 0;
let lastStatsTime = 0;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const gaussian = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const readPidParams = () => ({
  kp: Number(numberFrom("pid-kp", 8)),
  ki: Number(numberFrom("pid-ki", 1.5)),
  kd: Number(numberFrom("pid-kd", 5)),
  target: (numberFrom("pid-target", 30) * Math.PI) / 180,
  noise: (numberFrom("pid-noise", 0.1) * Math.PI) / 180,
  limit: numberFrom("pid-limit", 4),
});

const setOutputs = () => {
  const p = readPidParams();
  setText('[data-out="kp"]', p.kp.toFixed(1));
  setText('[data-out="ki"]', p.ki.toFixed(2));
  setText('[data-out="kd"]', p.kd.toFixed(1));
  setText('[data-out="target"]', `${Math.round((p.target * 180) / Math.PI)}°`);
  setText('[data-out="noise"]', `${((p.noise * 180) / Math.PI).toFixed(2)}°`);
  setText('[data-out="limit"]', p.limit.toFixed(1));
};

const integrate = () => {
  const p = readPidParams();
  const target = state.t >= STEP_TIME ? p.target : 0;

  const thetaMeas = state.theta + p.noise * gaussian();
  const omegaMeas = state.omega + p.noise * 0.5 * gaussian();
  const error = target - thetaMeas;

  const raw = p.kp * error + p.ki * state.integral - p.kd * omegaMeas;
  const command = clamp(raw, -p.limit, p.limit);
  const saturated = Math.abs(raw) > p.limit;

  if (
    Math.abs(error) < INTEGRAL_SEPARATION &&
    !(saturated && Math.sign(error) === Math.sign(raw))
  ) {
    state.integral += error * DT;
  }

  if (p.ki > 0.05) {
    const bound = p.limit / p.ki;
    state.integral = clamp(state.integral, -bound, bound);
  } else {
    state.integral = 0;
  }

  state.tau += (command - state.tau) * (DT / SERVO_TAU);

  const angularAcceleration =
    (state.tau + DISTURBANCE - DAMPING * state.omega) / INERTIA;

  state.omega += angularAcceleration * DT;
  state.theta += state.omega * DT;
  state.t += DT;

  if (saturated) state.saturatedTime += DT;

  if (state.t - state.lastSample >= 0.02) {
    state.lastSample = state.t;
    state.samples.push({
      t: state.t,
      theta: state.theta,
      target,
      tau: state.tau,
    });

    const cutoff = state.t - WINDOW - 2;
    while (state.samples.length && state.samples[0].t < cutoff) {
      state.samples.shift();
    }
  }
};

const resizeCanvas = () => {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  context?.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const draw = () => {
  if (!context || !canvas) return;
  const rect = canvas.getBoundingClientRect();
  const W = rect.width;
  const H = rect.height;
  if (W < 10 || H < 10) return;

  const p = readPidParams();
  const targetDeg = (p.target * 180) / Math.PI;
  const accent = "#ff6b3d";
  const teal = "#4fe0c8";
  const grid = "rgba(140, 155, 175, 0.16)";
  const labelColor = "rgba(150, 163, 183, 0.85)";

  context.clearRect(0, 0, W, H);

  const padL = 42;
  const padR = 14;
  const padT = 16;
  const padB = 22;
  const gap = 14;
  const thetaTop = padT;
  const thetaBottom = H * 0.64;
  const tauTop = thetaBottom + gap + 10;
  const tauBottom = H - padB;

  const tNow = state.t;
  const tMin = Math.max(0, tNow - WINDOW);
  const tMax = Math.max(WINDOW, tNow);
  const span = Math.max(0.001, tMax - tMin);

  const xAt = (t: number) => padL + ((t - tMin) / span) * (W - padL - padR);

  const samples = state.samples.filter((sample) => sample.t >= tMin - 0.1);
  let maxTheta = 0;
  for (const sample of samples) {
    maxTheta = Math.max(maxTheta, Math.abs(sample.theta));
  }
  const yTop = Math.max(targetDeg * 1.4, (maxTheta * 180) / Math.PI * 1.15, 5);
  const yBottom = Math.min(-2, -targetDeg * 0.08);

  const yAt = (valueDeg: number) =>
    thetaTop +
    ((yTop - valueDeg) / (yTop - yBottom)) * (thetaBottom - thetaTop);

  /* grid */
  context.strokeStyle = grid;
  context.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = thetaTop + ((thetaBottom - thetaTop) * i) / 4;
    context.beginPath();
    context.moveTo(padL, y);
    context.lineTo(W - padR, y);
    context.stroke();
  }
  for (let i = 0; i <= 6; i += 1) {
    const x = padL + ((W - padL - padR) * i) / 6;
    context.beginPath();
    context.moveTo(x, thetaTop);
    context.lineTo(x, tauBottom);
    context.stroke();
  }

  /* settling band ±2% */
  if (targetDeg > 0) {
    const band = targetDeg * 0.02;
    context.fillStyle = "rgba(79, 224, 200, 0.07)";
    context.fillRect(
      padL,
      yAt(targetDeg + band),
      W - padL - padR,
      Math.max(1, yAt(targetDeg - band) - yAt(targetDeg + band)),
    );
  }

  /* target line */
  context.setLineDash([4, 4]);
  context.strokeStyle = teal;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(padL, yAt(targetDeg));
  context.lineTo(W - padR, yAt(targetDeg));
  context.stroke();
  context.setLineDash([]);

  /* theta curve */
  context.strokeStyle = accent;
  context.lineWidth = 2;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.beginPath();
  let started = false;
  for (const sample of samples) {
    const x = xAt(sample.t);
    const y = yAt((sample.theta * 180) / Math.PI);
    if (!started) {
      context.moveTo(x, y);
      started = true;
    } else {
      context.lineTo(x, y);
    }
  }
  context.stroke();

  /* tau panel */
  context.strokeStyle = grid;
  context.beginPath();
  context.moveTo(padL, tauTop);
  context.lineTo(W - padR, tauTop);
  context.stroke();

  const tauMid = (tauTop + tauBottom) / 2;
  const tauScale = (tauBottom - tauTop) / 2 / Math.max(0.5, p.limit);

  context.strokeStyle = teal;
  context.globalAlpha = 0.75;
  context.lineWidth = 1.4;
  context.beginPath();
  started = false;
  for (const sample of samples) {
    const x = xAt(sample.t);
    const y = tauMid - sample.tau * tauScale;
    if (!started) {
      context.moveTo(x, y);
      started = true;
    } else {
      context.lineTo(x, y);
    }
  }
  context.stroke();
  context.globalAlpha = 1;

  /* labels */
  context.fillStyle = labelColor;
  context.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.textAlign = "right";
  context.fillText(`${yTop.toFixed(0)}°`, padL - 6, thetaTop + 4);
  context.fillText(`${targetDeg.toFixed(0)}°`, padL - 6, yAt(targetDeg) + 3);
  context.fillText("0°", padL - 6, yAt(0) + 3);
  context.textAlign = "right";
  context.fillText(`+${p.limit.toFixed(1)}`, padL - 6, tauTop + 8);
  context.fillText("0", padL - 6, tauMid + 3);
  context.fillText(`−${p.limit.toFixed(1)}`, padL - 6, tauBottom + 2);

  context.textAlign = "left";
  context.fillText(`−${WINDOW.toFixed(0)} s`, padL, H - 6);
  context.textAlign = "right";
  context.fillText("now", W - padR, H - 6);

  /* step marker */
  if (state.t >= STEP_TIME && STEP_TIME >= tMin) {
    const x = xAt(STEP_TIME);
    context.strokeStyle = "rgba(242, 193, 78, 0.4)";
    context.setLineDash([2, 4]);
    context.beginPath();
    context.moveTo(x, thetaTop);
    context.lineTo(x, tauBottom);
    context.stroke();
    context.setLineDash([]);
  }
};

const updateStats = () => {
  const p = readPidParams();
  const targetDeg = (p.target * 180) / Math.PI;

  setText('[data-pid="theta"]', `${((state.theta * 180) / Math.PI).toFixed(1)}°`);
  setText('[data-pid="sat"]', `${((state.saturatedTime / Math.max(state.t, 0.001)) * 100).toFixed(0)}%`);
  setText('[data-pid-clock]', `T+ ${state.t.toFixed(1)} s`);

  const after = state.samples.filter((sample) => sample.t >= STEP_TIME);
  if (!after.length) {
    setText('[data-pid="overshoot"]', "—");
    setText('[data-pid="settle"]', "—");
    setText('[data-pid="error"]', "—");
    setText('[data-pid="rms"]', "—");
    return;
  }

  let peak = -Infinity;
  const smoothed: { t: number; theta: number }[] = [];
  for (let index = 0; index < after.length; index += 1) {
    const start = Math.max(0, index - 24);
    let sum = 0;
    for (let cursor = start; cursor <= index; cursor += 1) {
      sum += after[cursor].theta;
    }
    const mean = sum / (index - start + 1);
    smoothed.push({ t: after[index].t, theta: mean });
    peak = Math.max(peak, mean);
  }

  const overshoot = Math.max(0, (peak * 180) / Math.PI - targetDeg);
  setText('[data-pid="overshoot"]', `${overshoot.toFixed(1)}°`);

  const band = targetDeg * 0.02;
  let lastOutside: number | null = null;
  for (const sample of smoothed) {
    const deg = (sample.theta * 180) / Math.PI;
    if (Math.abs(deg - targetDeg) > band) lastOutside = sample.t;
  }
  setText(
    '[data-pid="settle"]',
    lastOutside === null ? "0.0 s" : `${(lastOutside - STEP_TIME).toFixed(1)} s`,
  );

  const recent = state.samples.filter((sample) => sample.t >= state.t - 1);
  if (recent.length) {
    const mean =
      recent.reduce((sum, sample) => sum + (sample.theta * 180) / Math.PI, 0) /
      recent.length;
    setText('[data-pid="error"]', `${(mean - targetDeg).toFixed(2)}°`);
  }

  const rmsSamples = state.samples.filter((sample) => sample.t >= state.t - 2);
  if (rmsSamples.length) {
    const rms = Math.sqrt(
      rmsSamples.reduce((sum, sample) => sum + sample.tau * sample.tau, 0) /
        rmsSamples.length,
    );
    setText('[data-pid="rms"]', `${rms.toFixed(2)} N·m`);
  }
};

const frame = (now: number) => {
  if (!lastFrame) lastFrame = now;
  const elapsed = Math.min((now - lastFrame) / 1000, 0.1);
  lastFrame = now;

  if (running) {
    accumulated += elapsed;
    let steps = 0;
    while (accumulated >= DT && steps < 40) {
      integrate();
      accumulated -= DT;
      steps += 1;
    }
  }

  draw();

  if (now - lastStatsTime > 120) {
    updateStats();
    lastStatsTime = now;
  }

  requestAnimationFrame(frame);
};

const resetPid = () => {
  state = makeState();
  accumulated = 0;
  setOutputs();
  updateStats();
  draw();
};

for (const id of ["pid-kp", "pid-ki", "pid-kd", "pid-target", "pid-noise", "pid-limit"]) {
  const input = document.getElementById(id);
  input?.addEventListener("input", () => {
    setOutputs();
    resetPid();
  });
}

$("[data-pid-toggle]")?.addEventListener("click", (event) => {
  running = !running;
  const button = event.currentTarget as HTMLButtonElement;
  button.textContent = running ? "暂停" : "继续";
});

$("[data-pid-reset]")?.addEventListener("click", resetPid);

window.addEventListener("resize", () => {
  resizeCanvas();
  draw();
});

setOutputs();
resizeCanvas();
updateStats();
requestAnimationFrame(frame);
