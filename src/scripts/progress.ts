export {};

const STORAGE_KEY = "rfc-progress-v1";

const checkboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>("input[data-checkpoint]"),
);

const byPhase = new Map<string, HTMLInputElement[]>();
for (const box of checkboxes) {
  const phase = box.dataset.checkpoint?.split(":")[0] ?? "";
  const list = byPhase.get(phase) ?? [];
  list.push(box);
  byPhase.set(phase, list);
}

const readState = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set();
  }
};

const state = readState();

const saveState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state)));
  } catch {
    /* storage unavailable: progress will not persist */
  }
};

const fill = (element: Element | null, percent: number) => {
  if (element instanceof HTMLElement) {
    element.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  }
};

const update = () => {
  let done = 0;

  for (const box of checkboxes) {
    if (box.checked) done += 1;
  }

  const percent = checkboxes.length ? (done / checkboxes.length) * 100 : 0;
  fill(document.querySelector("[data-progress-fill]"), percent);

  const totalLabel = document.querySelector("[data-progress-label]");
  if (totalLabel) totalLabel.textContent = `${done} / ${checkboxes.length}`;

  const track = document.querySelector("[data-progress-track]");
  track?.setAttribute("aria-valuenow", String(done));

  for (const [phase, boxes] of byPhase) {
    const phaseDone = boxes.filter((box) => box.checked).length;
    const phasePercent = boxes.length ? (phaseDone / boxes.length) * 100 : 0;
    fill(document.querySelector(`[data-phase-fill="${phase}"]`), phasePercent);
    const label = document.querySelector(`[data-phase-label="${phase}"]`);
    if (label) label.textContent = `${phaseDone} / ${boxes.length}`;
  }
};

for (const box of checkboxes) {
  const key = box.dataset.checkpoint;
  if (key && state.has(key)) box.checked = true;
}

update();

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.matches("input[data-checkpoint]")) return;

  const key = target.dataset.checkpoint;
  if (!key) return;

  if (target.checked) state.add(key);
  else state.delete(key);

  saveState();
  update();
});

document.querySelector("[data-progress-reset]")?.addEventListener("click", () => {
  if (checkboxes.every((box) => !box.checked)) return;
  const confirmed = window.confirm("确定清空本浏览器中保存的所有路线图进度吗？");
  if (!confirmed) return;

  state.clear();
  for (const box of checkboxes) box.checked = false;
  saveState();
  update();
});
