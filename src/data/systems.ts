export interface SystemModule {
  id: string;
  code: string;
  title: string;
  en: string;
  summary: string;
  topics: string[];
  deliverable: string;
  checkpoints: string[];
}

export interface Track {
  id: string;
  label: string;
  title: string;
  en: string;
  lead: string;
  modules: SystemModule[];
}

export const TRACKS: Track[] = [
  {
    id: "fsw",
    label: "TRACK A",
    title: "飞行软件",
    en: "Flight Software",
    lead:
      "把控制律、估计器和状态机写成能在真实硬件上按时代码。重点是实时性、内存确定性与失效可控，而不是语法技巧。",
    modules: [
      {
        id: "cpp",
        code: "A1",
        title: "C++20 与安全关键代码",
        en: "C++ for safety-critical systems",
        summary:
          "“零开销抽象”在飞控里意味着：编译期确定、运行期不分配、错误可追踪。语言特性要服务于可验证性。",
        topics: [
          "值语义与 RAII",
          "constexpr 与模板",
          "禁用异常 / RTTI / 动态分配",
          "固定容量容器",
          "错误码与 expected",
          "MISRA / JPL / Power of 10",
        ],
        deliverable:
          "一个无堆分配的姿态状态机与固定容量日志库，附单元测试、静态分析与 MISRA 偏差说明。",
        checkpoints: [
          "能解释为什么初始化完成后禁止堆分配",
          "能用 ASan / UBSan / Cppcheck 跑通并解释告警",
          "能为每条 MISRA 偏差写出理由与替代控制",
        ],
      },
      {
        id: "realtime",
        code: "A2",
        title: "实时系统与调度",
        en: "Real-time scheduling",
        summary:
          "实时不是“快”，而是“最坏情况下也能按时”。先测抖动与 WCET，再谈优化；平均值没有工程意义。",
        topics: [
          "优先级与抢占",
          "p99 / p99.9 抖动",
          "WCET 与预算",
          "优先级反转",
          "无锁队列与内存屏障",
          "缓存与 NUMA",
        ],
        deliverable:
          "1 kHz 控制回路的抖动报告：Linux 与 MCU 各一份，含直方图、最坏值与一次人为干扰实验。",
        checkpoints: [
          "能测出并解释 p99 抖动",
          "能复现一次优先级反转并给出修复",
          "能给出任务级 CPU 与时间预算表",
        ],
      },
      {
        id: "os",
        code: "A3",
        title: "OS、分区与虚拟化",
        en: "RTOS, Linux & partitioning",
        summary:
          "选择 OS 的本质是选择失效模型。RT Linux、RTOS、ARINC 653 分区与 Type-1 Hypervisor 各有代价。",
        topics: [
          "Linux 6.12+ PREEMPT_RT",
          "FreeRTOS",
          "Zephyr",
          "ARINC 653 时空隔离",
          "Xen / Bao / PikeOS",
          "看门狗与启动恢复",
        ],
        deliverable:
          "RT Linux 上运行 1 kHz 回路，同时用一个 Zephyr/FreeRTOS 节点采集 IMU，通过 CAN FD 交换数据。",
        checkpoints: [
          "能配置 PREEMPT_RT 并用 cyclictest 验证",
          "能解释时间隔离与空间隔离的差别",
          "能设计冷启动、热重启与看门狗恢复流程",
        ],
      },
      {
        id: "frameworks",
        code: "A4",
        title: "飞控框架与架构",
        en: "Flight software frameworks",
        summary:
          "不要从零发明框架。读 F´、cFS 与 PX4 的组件、端口、线程与命令模型，再决定哪些必须自研。",
        topics: [
          "F´ 组件 / 端口",
          "cFS 应用 / 软件总线",
          "PX4 模块化",
          "Actor-Judge 与三余度",
          "命令 / 遥测 / 参数",
          "故障隔离",
        ],
        deliverable:
          "用 F´ 或 cFS 实现“传感器 → 估计 → 控制 → 遥测”四组件应用，并画出线程与数据流。",
        checkpoints: [
          "能画组件、端口、线程与队列图",
          "能解释命令校验与危险指令保护",
          "能写出框架选型与自研边界的理由",
        ],
      },
      {
        id: "gnc",
        code: "A5",
        title: "GNC 的 C++ 实现",
        en: "GNC implementation",
        summary:
          "GNC 的实现难点不在公式，而在坐标系、单位、数值稳定性与实时预算。每个模块都要有参考实现可对照。",
        topics: [
          "Eigen 与线性代数",
          "四元数 / DCM",
          "EKF / 互补滤波",
          "级联 PID / LQR",
          "制导与轨迹",
          "定点 / 浮点与饱和",
        ],
        deliverable:
          "C++ 六自由度模型 + EKF + 控制器闭环，与 Python 参考实现逐项对齐，并给出 CPU 占用。",
        checkpoints: [
          "能对齐 Python 与 C++ 的输出误差",
          "能处理传感器丢帧、饱和与异常值",
          "能给出每个控制周期的计算预算",
        ],
      },
      {
        id: "verification",
        code: "A6",
        title: "容错、验证与 HIL",
        en: "Fault tolerance & verification",
        summary:
          "飞控的可信度来自验证链：单元测试 → SIL → HIL → 故障注入 → 蒙特卡洛 → 飞行复盘。缺一环就只是演示。",
        topics: [
          "TMR / 投票",
          "故障注入",
          "看门狗 / 失效保护",
          "GoogleTest / Catch2",
          "静态分析 / sanitizer",
          "HIL / CI 蒙特卡洛",
        ],
        deliverable:
          "HIL 台架 + 1000 次蒙特卡洛 + 三类故障注入报告（传感器、总线、执行机构）。",
        checkpoints: [
          "能注入三类故障并触发预期保护",
          "能定义可量化的 go / no-go 判据",
          "能复现一次失败、定位根因并回归",
        ],
      },
    ],
  },
  {
    id: "comms",
    label: "TRACK B",
    title: "通信与地面段",
    en: "Communications & Ground",
    lead:
      "通信不是“把数据发出去”，而是在带宽、延迟、丢包、干扰与中断下，仍然让地面知道飞行器在哪、在做什么、下一步做什么。",
    modules: [
      {
        id: "rf",
        code: "B1",
        title: "链路预算与 RF 基础",
        en: "Link budget & RF",
        summary:
          "先算链路预算，再选调制。没有余量的链路，任何编码都救不回来；先明确频段、距离、天线与噪声。",
        topics: [
          "EIRP 与 G/T",
          "自由空间损耗",
          "噪声温度",
          "调制与带宽",
          "香农限",
          "天线与多普勒",
        ],
        deliverable:
          "一份 S 或 X 波段下行链路预算表，显式列出雨衰、指向误差、多普勒与 6 dB 以上余量。",
        checkpoints: [
          "能独立计算链路余量并做敏感性分析",
          "能解释调制阶数与带宽 / 功率的权衡",
          "能估算低轨任务的最大多普勒与变化率",
        ],
      },
      {
        id: "sdr",
        code: "B2",
        title: "信道编码与 SDR",
        en: "FEC & software-defined radio",
        summary:
          "编码增益是“用计算换功率”。SDR 让这套链路可以在桌面上复现，但射频合规与前端性能仍是硬约束。",
        topics: [
          "LDPC / 卷积 / RS",
          "交织与打孔",
          "AFF3CT",
          "GNU Radio",
          "liquid-dsp",
          "FutureSDR",
        ],
        deliverable:
          "AWGN 信道下的 CCSDS 兼容编码 / 解码链路，输出 BER / BLER 曲线，并与理论值对照。",
        checkpoints: [
          "能画出 BER 曲线并解释编码增益",
          "能把流式链路接到文件或网络 sink",
          "能说明桌面 SDR 与飞行硬件的差异",
        ],
      },
      {
        id: "buses",
        code: "B3",
        title: "箭内总线与时间同步",
        en: "Avionics buses",
        summary:
          "箭内总线的核心是确定性与冗余，不是峰值带宽。先理解时序，再谈协议栈。",
        topics: [
          "CAN / CAN FD",
          "TSN / TTEthernet",
          "SpaceWire / SpaceFibre",
          "MIL-STD-1553 / ARINC 429",
          "RS-422 / RS-485",
          "PTP / 时间戳",
        ],
        deliverable:
          "CAN FD ↔ 以太网网关，带硬件时间戳、丢包统计、双总线冗余切换与抓包分析。",
        checkpoints: [
          "能用逻辑分析仪 / 抓包工具分析一次时序",
          "能解释 TSN / TTEthernet 的调度与隔离",
          "能设计并验证双总线切换策略",
        ],
      },
      {
        id: "ccsds",
        code: "B4",
        title: "CCSDS 与空间数据链路",
        en: "CCSDS space data links",
        summary:
          "CCSDS 是航天数据链路的共同语法。先实现空间包，再实现帧，再谈加密与跨链路。",
        topics: [
          "CCSDS 133.0 空间包",
          "131.0 TM / TC",
          "132.0 AOS",
          "231.0 / 232.0",
          "732.1 USLP",
          "SDLS 链路安全",
        ],
        deliverable:
          "Space Packet 编解码器 + CCSDS TM 帧解析器 + 一组一致性测试向量与抓包回放。",
        checkpoints: [
          "能解析主头 / 副头与虚拟信道",
          "能处理分包、丢包与重组",
          "能用测试向量验证编解码一致性",
        ],
      },
      {
        id: "middleware",
        code: "B5",
        title: "中间件、序列化与地面段",
        en: "Middleware & ground segment",
        summary:
          "地面段不是“串口助手”。它要能配置、排程、监控、回放与审计；中间件要能跨有线 / 无线 / 云端。",
        topics: [
          "DDS / Fast DDS",
          "Eclipse Zenoh",
          "MAVLink",
          "nanopb / FlatBuffers",
          "libcsp",
          "Yamcs / OpenC3 / Open MCT",
        ],
        deliverable:
          "飞控遥测 → Zenoh 或 DDS → Yamcs / Open MCT 的实时显示与历史回放，含断线重连。",
        checkpoints: [
          "能定义消息 schema 并做版本兼容",
          "能处理断线重连与背压",
          "能回放一次完整任务并定位异常",
        ],
      },
      {
        id: "security",
        code: "B6",
        title: "网络安全、DTN 与任务网络",
        en: "Security, DTN & mission network",
        summary:
          "一旦链路可被注入、重放或中断，安全与容迟就是任务的一部分，而不是上线前补的选项。",
        topics: [
          "CCSDS SDLS",
          "认证 / 加密 / 密钥轮换",
          "DTN BPv7（RFC 9171）",
          "多路径与 QUIC",
          "时间同步与审计",
          "中断恢复",
        ],
        deliverable:
          "DTN 存储转发演示 + 链路中断 / 恢复测试 + 一次密钥轮换演练与日志审计。",
        checkpoints: [
          "能解释 bundle 的生命周期与保管责任",
          "能测量链路中断后的恢复时间",
          "能完成密钥轮换并验证旧密钥失效",
        ],
      },
    ],
  },
];

export interface PlanRow {
  window: string;
  phase: string;
  title: string;
  focus: string;
  deliverable: string;
  gate: string;
}

export const PLAN: PlanRow[] = [
  {
    window: "第 0–3 周",
    phase: "00",
    title: "现实核对与工具链",
    focus: "C++20、CMake、Git、Linux、示波器、逻辑分析仪；明确不碰推进系统。",
    deliverable: "干净机器可复现的构建、烧录、单元测试与日志基线。",
    gate: "CI 在全新容器中通过；硬件 blink + 串口日志可复现。",
  },
  {
    window: "第 4–10 周",
    phase: "01",
    title: "实时 C++ 与 MCU",
    focus: "固定容量容器、无堆、FreeRTOS / Zephyr、CAN、传感器驱动。",
    deliverable: "1 kHz 传感器节点 + 抖动报告 + CAN 协议草案。",
    gate: "p99 抖动与 CPU 预算达标；总线错误可检测。",
  },
  {
    window: "第 11–18 周",
    phase: "02",
    title: "RT Linux 与箭内总线",
    focus: "PREEMPT_RT、驱动、SocketCAN、时间戳、双总线冗余。",
    deliverable: "RT Linux 1 kHz 回路 + CAN FD / 以太网网关。",
    gate: "最坏抖动、丢包与切换时间可测量且满足指标。",
  },
  {
    window: "第 19–28 周",
    phase: "03",
    title: "飞控框架与 GNC",
    focus: "F´ / cFS、Eigen、EKF、级联 PID / LQR、故障隔离。",
    deliverable: "四组件飞控 + C++ / Python 对照 + 日志系统。",
    gate: "输出一致；单传感器失效可安全降级。",
  },
  {
    window: "第 29–38 周",
    phase: "04",
    title: "制导与嵌入求解器",
    focus: "CVXPYgen / CVXGEN、OSQP / Clarabel、acados 原型、约束检查。",
    deliverable: "二维落点 / 着陆制导，生成 C 代码并嵌入闭环。",
    gate: "约束满足率、终端精度与最坏计算时间达标。",
  },
  {
    window: "第 39–48 周",
    phase: "05",
    title: "通信栈与地面段",
    focus: "CCSDS、SDR、AFF3CT、Yamcs / OpenC3 / Open MCT。",
    deliverable: "端到端遥测链路：飞控 → RF / 有线 → 地面显示与回放。",
    gate: "BER / 丢包 / 恢复时间达标；链路预算有余量。",
  },
  {
    window: "第 49–60 周",
    phase: "06",
    title: "容错、HIL 与验证",
    focus: "故障注入、TMR、蒙特卡洛、CI、回归与复盘。",
    deliverable: "HIL 台架 + 1000 次蒙特卡洛 + 三类故障报告。",
    gate: "故障均安全收敛；失败可复现、可定位、可回归。",
  },
  {
    window: "第 61–72 周",
    phase: "07",
    title: "综合演示（可选）",
    focus: "全链路集成、外部评审、开源文档与数据。",
    deliverable: "可复现的 demo + 技术报告 + 已知限制清单。",
    gate: "第三方按文档可在两周内复现核心结果。",
  },
];

export interface StackChoice {
  layer: string;
  pick: string;
  reason: string;
  risk: string;
}

export const STACK: StackChoice[] = [
  {
    layer: "飞控 OS",
    pick: "Linux 6.12+ PREEMPT_RT（主计算机）+ FreeRTOS / Zephyr（MCU 节点）",
    reason: "与公开的 SpaceX 架构同属 Linux + C/C++ 路线，主线内核省去旧补丁维护。",
    risk: "Linux 的适航证据链弱；安全关键功能需分区、双核或独立看门狗。",
  },
  {
    layer: "语言",
    pick: "C++20 核心 + C HAL；Rust 可选（地面工具 / 协议解析）",
    reason: "航天生态、工具链与人才储备最成熟；C++20 兼顾性能与抽象。",
    risk: "必须禁用异常、RTTI 与运行期堆分配；Rust 认证工具链尚未覆盖 DAL A。",
  },
  {
    layer: "GNC 数学",
    pick: "Eigen + Python 原型；CVXPYgen / CVXGEN 生成 C；OSQP / Clarabel；acados 做 NMPC 原型",
    reason: "工业界常用组合，代码生成避免手写内点法，便于验证与复查。",
    risk: "生成代码仍需独立验证；实时性高度依赖问题规模与热启动策略。",
  },
  {
    layer: "箭内总线",
    pick: "CAN FD + 交换式以太网（学习阶段）；TSN / TTEthernet 作为进阶",
    reason: "CAN FD 成本低、生态好；确定性以太网是现代箭上趋势。",
    risk: "TSN / TTE 硬件与工具昂贵；先用 CAN FD + 时间戳建立正确直觉。",
  },
  {
    layer: "中间件",
    pick: "Zenoh 或 Fast DDS；FlatBuffers / nanopb；MAVLink 仅用于原型",
    reason: "发布-订阅、跨网段与多语言支持，适合箭内到地面的统一数据面。",
    risk: "无线链路上需评估发现流量与开销；MAVLink 不适合作为安全关键主协议。",
  },
  {
    layer: "RF 与地面",
    pick: "CCSDS + AFF3CT + GNU Radio / FutureSDR + Yamcs / OpenC3 + Open MCT",
    reason: "全开源、可复现，能搭出接近真实任务控制室的链路与界面。",
    risk: "射频发射需许可；SDR 前端动态范围与滤波决定上限。",
  },
  {
    layer: "仿真与验证",
    pick: "C++ / Eigen 六自由度 + JSBSim / Basilisk 交叉验证 + RocketPy 弹道 + HIL + CI 蒙特卡洛",
    reason: "多工具交叉验证，避免“自己验证自己”；CI 把回归变成日常。",
    risk: "模型一致性、实时性与测试覆盖率需要显式管理。",
  },
];

export type Maturity = "production" | "early" | "research" | "watch";

export const MATURITY_LABEL: Record<Maturity, string> = {
  production: "已在任务 / 生产中使用",
  early: "早期采用",
  research: "研究 / 原型",
  watch: "观察",
};

export interface Trend {
  id: string;
  index: string;
  title: string;
  maturity: Maturity;
  summary: string;
  evidence: string;
  learn: string;
  caveat: string;
}

export const TRENDS: Trend[] = [
  {
    id: "space-relay",
    index: "01",
    title: "天基中继与 IP 化遥测",
    maturity: "production",
    summary:
      "火箭不再只依赖地面站视距。低轨星座大幅扩展测控覆盖，链路层正在向 IP / 容迟网络演进。",
    evidence:
      "SpaceX 在 2026 年 Starship 任务中公开演示了通过 Starlink 终端回传高清视频与大量遥测。",
    learn: "链路预算、IP over satellite、DTN（RFC 9171）、QUIC、多路径与丢包恢复。",
    caveat:
      "星座覆盖、频谱许可与终端功耗仍是约束；“黑障期间靠顶部天线”等细节未公开，不能当作通用方案。",
  },
  {
    id: "preempt-rt",
    index: "02",
    title: "主线 PREEMPT_RT 与混合关键性",
    maturity: "early",
    summary:
      "实时 Linux 从“打补丁”变成主线能力，混合关键性系统用分区 / Hypervisor 把高安全飞控与高算力负载隔离。",
    evidence:
      "Linux 6.12（2024）正式合入 PREEMPT_RT，支持 x86、ARM64、RISC-V；Orion / Ariane 6 使用 TTEthernet，NASA Gateway 选用 TTEthernet 网络方案。",
    learn: "RT 调优、cyclictest、WCET、时间 / 空间隔离、Xen / Bao / PikeOS 的基本模型。",
    caveat:
      "主线合并不等于适航认证；高安全等级仍需完整的证据链、配置控制与独立验证。",
  },
  {
    id: "rust",
    index: "03",
    title: "Rust、内存安全与形式化验证",
    maturity: "early",
    summary:
      "Rust 正从地面工具、协议解析器和外围节点切入。认证工具链与形式化验证在快速成熟，但尚未成为飞行主控默认选项。",
    evidence:
      "Ferrocene 工具链已完成 ISO 26262 ASIL D、IEC 61508 SIL 3（支持客户向 SIL 4）与 IEC 62304 Class C 的工具资格认定，并支持 DO-178C DAL C 的认证工作；Kani、Frama-C 等验证工具可用。",
    learn: "no_std Rust、FFI、内存模型、Kani、Frama-C、MISRA 与形式化方法的取舍。",
    caveat:
      "DO-178C DAL A 的端到端目标码鉴定仍未成熟；现有飞控主控仍以 C/C++/Ada 为主。",
  },
  {
    id: "heterogeneous",
    index: "04",
    title: "异构 RISC-V / FPGA / AI 计算",
    maturity: "research",
    summary:
      "抗辐射计算从单核 CPU 走向“实时核 + 应用核 + FPGA + AI 加速器”的异构 SoC，用硬件隔离替代软件补救。",
    evidence:
      "NASA HPSC 为 10 核异构 RISC-V 抗辐射 SoC（与 Microchip 合作）；Microchip PolarFire SoC 提供 RISC-V + FPGA，AMD Versal ACAP 提供 Arm + FPGA + AI 引擎，均有面向航天的器件方向。",
    learn: "FPGA、TMR、HW/SW 协同设计、Hypervisor、辐射效应与看门狗。",
    caveat:
      "器件与工具链可获得性、辐射测试数据、长期供货与软件生态仍需评估；不要假设“算力越大越安全”。",
  },
  {
    id: "safe-ai",
    index: "05",
    title: "Safe AI 与经典控制的融合",
    maturity: "research",
    summary:
      "纯神经网络不会直接取代主发动机控制。更现实的路径是：AI 做感知 / 热启动 / 参数调度，经典控制与优化做可证明的闭环。",
    evidence:
      "神经网络热启动 + 凸优化、控制障碍函数（CBF）、TRN / 危险规避等方向有大量论文与原型；毅力号与部分月面任务使用视觉相对导航 / 危险检测。",
    learn: "凸优化、MPC、CBF、运行时监控、分布外检测、AI 验证与确认。",
    caveat:
      "“AI 已自主控制着陆”不成立；认证路径、可解释性与最坏情况保证仍未解决。",
  },
  {
    id: "mbse",
    index: "06",
    title: "MBSE / SysML v2 与 CI/CD 发射验证",
    maturity: "early",
    summary:
      "需求、架构、模型、代码与测试正在被同一条数字线程串起来；云端蒙特卡洛与 HIL 回归成为合并门槛。",
    evidence:
      "SysML v2 标准与工具链逐步落地；航天团队用容器化仿真、HIL 与自动化回归做“发射前 CI”。",
    learn: "SysML v2、数字线程、容器化仿真、回归测试、配置管理与证据追溯。",
    caveat:
      "工具易买、流程难改；没有配置管理与测试文化，MBSE 只会生成更多文档。",
  },
];

export type Verdict = "verified" | "partial" | "corrected" | "unverified";

export const VERDICT_LABEL: Record<Verdict, string> = {
  verified: "已核实",
  partial: "部分属实",
  corrected: "需修正",
  unverified: "未证实",
};

export interface Fact {
  claim: string;
  verdict: Verdict;
  detail: string;
  source?: { label: string; href: string };
}

export const FACTS: Fact[] = [
  {
    claim:
      "Falcon 9 飞控使用三台双核 x86 计算机、每核一个 Linux 实例、C/C++ 编写，并用 Actor-Judge 模式做命令仲裁与三余度。",
    verdict: "verified",
    detail:
      "SpaceX 软件团队公开 AMA 与 ZDNet 等报道一致。具体内核配置、仲裁逻辑与代码不公开。",
    source: {
      label: "SpaceX 软件 AMA 摘要",
      href: "https://www.reddit.com/r/spacex/comments/nd9ipw/summary_of_spacex_software_ama/",
    },
  },
  {
    claim: "SpaceX 飞控运行 Linux + PREEMPT_RT。",
    verdict: "partial",
    detail:
      "公开资料显示 Falcon / Dragon 使用定制 Linux（约 3.2 内核）加实时补丁；是否等同今天的主线 PREEMPT_RT、当前版本与配置均未公开。",
    source: {
      label: "2017 eLinux：Linux in spacecraft flight software",
      href: "https://elinux.org/images/9/94/2017_Leppinen_-_Current_use_of_Linux_in_spacecraft_flight_software.pdf",
    },
  },
  {
    claim: "Falcon 9 着陆制导使用凸优化，并用 CVXGEN 生成飞行代码。",
    verdict: "partial",
    detail:
      "SpaceX 的 Lars Blackmore 在公开演讲 / 文章中介绍过凸优化着陆与 CVXGEN 生成代码；这属于公开技术叙述，完整实现与当前版本未公开。",
    source: {
      label: "Blackmore：Autonomous Precision Landing",
      href: "https://www.nae.edu/157871/Autonomous-Precision-Landing-of-Space-Rockets",
    },
  },
  {
    claim: "Starship 通过 Starlink 回传实时视频与遥测。",
    verdict: "verified",
    detail:
      "SpaceX 2026 年任务更新与公开报道展示了 Starlink 终端在飞行与再入阶段回传高清视频和遥测。黑障期间的详细链路机制未公开。",
    source: { label: "SpaceX Updates", href: "https://www.spacex.com/updates" },
  },
  {
    claim: "Linux 6.12 已将 PREEMPT_RT 合入主线。",
    verdict: "verified",
    detail:
      "2024 年 9 月合并，Linux 6.12 起在 x86、ARM64、RISC-V 上支持主线实时抢占。",
    source: {
      label: "Phoronix：Linux 6.12 real-time",
      href: "https://www.phoronix.com/news/Linux-6.12-Does-Real-Time",
    },
  },
  {
    claim: "VxWorks 用于 Orion / SLS、JWST 与火星车。",
    verdict: "verified",
    detail:
      "Wind River 与 NASA 公开资料确认这些任务使用 VxWorks；这不代表所有子系统或所有飞行阶段都用同一 OS。",
    source: { label: "Wind River in space", href: "https://windriver.com/inspace" },
  },
  {
    claim: "TTEthernet 已成为下一代火箭与空间站的标配。",
    verdict: "partial",
    detail:
      "TTEthernet 已用于 Orion、Ariane 6，并被选为 NASA Gateway 的网络方案；但 CAN/CAN FD、交换式以太网与其他总线仍广泛存在，“标配”不准确。",
    source: {
      label: "TTTech / RUAG：Gateway TTEthernet",
      href: "https://tttech.com/ruag-space-and-tttech-partner-to-provide-electronics-for-nasa-lunar-gateway",
    },
  },
  {
    claim: "DIFI 让地面站把 RF 数字化为 IP 流，AWS / Azure 已采用。",
    verdict: "verified",
    detail:
      "DIFI（IEEE-ISTO 4900）定义数字中频互操作；AWS Ground Station 使用 DigIF / VITA-49.2，Microsoft 是 DIFI 创始成员。具体架构因供应商而异。",
    source: { label: "DIFI 标准", href: "https://dificonsortium.org/standards/" },
  },
  {
    claim: "Ferrocene 已通过 ASIL-D 与 SIL-4，并正在推进 DO-178C。",
    verdict: "corrected",
    detail:
      "实际为 ISO 26262 ASIL D、IEC 61508 SIL 3（支持客户向 SIL 4 认证）、IEC 62304 Class C；支持 DO-178C DAL C 的认证工作，并非已获 DO-178C 认证。",
    source: { label: "Ferrocene Aerospace", href: "https://ferrocene.dev/industries" },
  },
  {
    claim: "Rust 已经可以用于 DO-178C DAL A 飞控。",
    verdict: "corrected",
    detail:
      "公开信息支持到 DO-178C DAL C 的认证工作；DAL A 需要端到端目标码鉴定，目前仍未成熟。",
    source: { label: "Ferrous Systems", href: "https://ferrous-systems.com/blog/sealed-rust-the-plan" },
  },
  {
    claim: "FATROP / acados 把 NMPC 压到亚毫秒级。",
    verdict: "corrected",
    detail:
      "典型为毫秒级；亚毫秒取决于问题规模、RTI、硬件与热启动。FATROP 论文报告的机器人问题为数十毫秒级。",
    source: { label: "FATROP", href: "https://github.com/meco-group/fatrop" },
  },
  {
    claim: "Clarabel 全面优于 ECOS。",
    verdict: "corrected",
    detail:
      "Clarabel 论文报告在广泛基准上更快、更稳健；CVXPY 社区已讨论将其作为默认开源内点法求解器。说“全面优于”不严谨。",
    source: { label: "Clarabel 论文", href: "https://arxiv.org/abs/2405.12762" },
  },
  {
    claim: "NASA HPSC 是 10 核异构 RISC-V 抗辐射 SoC。",
    verdict: "verified",
    detail:
      "NASA 与 Microchip 合作开发，面向 2040+ 任务，强调容错、功耗与互联。具体性能与供货时间以官方为准。",
    source: {
      label: "NASA HPSC",
      href: "https://www.nasa.gov/game-changing-development-projects/high-performance-spaceflight-computing-hpsc",
    },
  },
  {
    claim: "神经网络热启动 + CBF 已经在火箭着陆中实际落地。",
    verdict: "unverified",
    detail:
      "属于研究 / 原型方向。公开的毅力号与部分月面任务使用视觉相对导航 / 危险检测，不是端到端神经网络控制主发动机。",
  },
  {
    claim: "Zephyr 正在取代 FreeRTOS。",
    verdict: "partial",
    detail:
      "Zephyr 增长快、功能现代（Devicetree、CAN、网络、Rust 绑定），但 FreeRTOS 仍大量用于 MCU 与遗产系统，“取代”言过其实。",
  },
  {
    claim: "MATLAB/Simulink 是 Blue Origin、ULA、Rocket Lab、NASA SLS 的 GNC 主流程。",
    verdict: "unverified",
    detail:
      "Simulink 在航空航天 GNC 与模型化设计中广泛使用，但具体公司 / 项目流程未逐一公开，不能当作事实陈述。",
  },
];

export interface SystemResource {
  title: string;
  author: string;
  group: "C/C++ 与实时" | "通信与地面" | "验证与工具";
  kind: "书" | "标准" | "框架" | "库" | "工具";
  level: "入门" | "核心" | "进阶" | "参考";
  note: string;
  href?: string;
}

export const SYSTEM_RESOURCES: SystemResource[] = [
  {
    title: "A Tour of C++（3rd Edition）",
    author: "Bjarne Stroustrup · 2022",
    group: "C/C++ 与实时",
    kind: "书",
    level: "核心",
    note: "现代 C++ 的最短路径：值语义、RAII、模板与标准库。先读这本，再读安全关键规范。",
  },
  {
    title: "Real-Time C++（4th Edition）",
    author: "Christopher Kormany · 2021",
    group: "C/C++ 与实时",
    kind: "书",
    level: "进阶",
    note: "面向微控制器的现代 C++：无堆、固定容器、模板与实时约束。",
  },
  {
    title: "C++ Concurrency in Action（2nd Edition）",
    author: "Anthony Williams · 2019",
    group: "C/C++ 与实时",
    kind: "书",
    level: "进阶",
    note: "内存模型、原子操作、无锁结构与并发设计。读之前先补 C++ 基础。",
  },
  {
    title: "Effective Modern C++",
    author: "Scott Meyers · 2014",
    group: "C/C++ 与实时",
    kind: "书",
    level: "核心",
    note: "移动语义、完美转发、lambda 与类型推导。避免“会写但写错”的现代 C++。",
  },
  {
    title: "Programming Embedded Systems（2nd Edition）",
    author: "Michael Barr, Anthony Massa · 2006",
    group: "C/C++ 与实时",
    kind: "书",
    level: "入门",
    note: "嵌入式 C 的基础：启动、内存、中断、外设与调试。年代较早但概念仍准确。",
  },
  {
    title: "Mastering the FreeRTOS Real Time Kernel",
    author: "Richard Barry · 免费 PDF",
    group: "C/C++ 与实时",
    kind: "书",
    level: "核心",
    note: "FreeRTOS 官方教程：任务、队列、信号量、优先级与移植。",
    href: "https://www.freertos.org/Documentation/RTOS_book.html",
  },
  {
    title: "Real-Time Concepts for Embedded Systems",
    author: "Qing Li, Caroline Yao · 2003",
    group: "C/C++ 与实时",
    kind: "书",
    level: "核心",
    note: "实时系统概念的系统性入门：调度、同步、内存与中断。",
  },
  {
    title: "Mastering Embedded Linux Programming（3rd Edition）",
    author: "Chris Simmonds, Frank Vasquez · 2021",
    group: "C/C++ 与实时",
    kind: "书",
    level: "进阶",
    note: "构建系统、内核、驱动、启动与调试。做 RT Linux 主计算机前的必备背景。",
  },
  {
    title: "Linux System Programming（2nd Edition）",
    author: "Robert Love · 2013",
    group: "C/C++ 与实时",
    kind: "书",
    level: "核心",
    note: "文件、进程、线程、信号、时间与内存映射。飞控主计算机的日常 API。",
  },
  {
    title: "Fault-Tolerant Systems（2nd Edition）",
    author: "Israel Koren, C. Mani Krishna · 2020",
    group: "C/C++ 与实时",
    kind: "书",
    level: "进阶",
    note: "冗余、投票、检查点、故障模型与可靠性分析。做 TMR 前先读。",
  },
  {
    title: "The Power of 10: Rules for Developing Safety-Critical Code",
    author: "Gerard Holzmann · 2006",
    group: "C/C++ 与实时",
    kind: "标准",
    level: "核心",
    note: "NASA/JPL 的十条安全关键编码规则：短函数、限制指针、编译告警清零等。",
    href: "https://spinroot.com/gerard/pdf/P10.pdf",
  },
  {
    title: "MISRA C++:2023",
    author: "MISRA · 2023",
    group: "C/C++ 与实时",
    kind: "标准",
    level: "参考",
    note: "C++ 安全关键编码规范。不要把它当“风格指南”，它是可审计的约束集合。",
    href: "https://misra.org.uk/",
  },
  {
    title: "JPL Institutional Coding Standard for C",
    author: "NASA JPL",
    group: "C/C++ 与实时",
    kind: "标准",
    level: "参考",
    note: "JPL 的 C 语言编码规则，强调可验证性与避免未定义行为。",
  },
  {
    title: "NASA-STD-8739.8",
    author: "NASA",
    group: "C/C++ 与实时",
    kind: "标准",
    level: "参考",
    note: "软件保证与软件安全标准。理解“证据链”而不是只写代码。",
    href: "https://standards.nasa.gov/standard/NASA/NASA-STD-87398",
  },
  {
    title: "Digital Avionics Handbook（3rd Edition）",
    author: "Cary Spitzer · 2017",
    group: "C/C++ 与实时",
    kind: "书",
    level: "参考",
    note: "航电系统、总线、软件与适航的参考手册。按需查阅，不必通读。",
  },
  {
    title: "Space Mission Engineering: The New SMAD",
    author: "James Wertz et al. · 2011",
    group: "C/C++ 与实时",
    kind: "书",
    level: "参考",
    note: "任务设计、系统工程与可靠性。用来理解飞控在整星 / 整箭中的位置。",
  },

  {
    title: "Deep Space Communications",
    author: "Jim Taylor (ed.) · 2016",
    group: "通信与地面",
    kind: "书",
    level: "进阶",
    note: "JPL 深空通信系列：链路、调制、编码、测控与任务设计。",
  },
  {
    title: "Digital Communications（5th Edition）",
    author: "John Proakis, Masoud Salehi · 2007",
    group: "通信与地面",
    kind: "书",
    level: "进阶",
    note: "数字通信的标准教材：调制、检测、均衡与信息论基础。",
  },
  {
    title: "Error Control Coding（2nd Edition）",
    author: "Shu Lin, Daniel Costello · 2004",
    group: "通信与地面",
    kind: "书",
    level: "进阶",
    note: "分组码、卷积码、Turbo / LDPC 的理论基础。配合 AFF3CT 实践。",
  },
  {
    title: "Software-Defined Radio for Engineers",
    author: "Travis Collins et al. · 2018",
    group: "通信与地面",
    kind: "书",
    level: "核心",
    note: "ADI 免费教材：RF、采样、调制、同步与 SDR 实现。",
    href: "https://www.analog.com/en/resources/technical-books/software-defined-radio-for-engineers.html",
  },
  {
    title: "CCSDS 出版物",
    author: "CCSDS",
    group: "通信与地面",
    kind: "标准",
    level: "核心",
    note: "131.0（TM/TC）、132.0（AOS）、133.0（空间包）、231.0/232.0、732.1（USLP）等蓝皮书入口。",
    href: "https://ccsds.org/publications/",
  },
  {
    title: "RFC 9171: Bundle Protocol Version 7",
    author: "IETF · 2022",
    group: "通信与地面",
    kind: "标准",
    level: "进阶",
    note: "DTN 的核心协议。理解存储转发、保管与跨越中断的通信模型。",
    href: "https://www.rfc-editor.org/rfc/rfc9171.html",
  },
  {
    title: "NASA F´ (F Prime)",
    author: "NASA JPL",
    group: "通信与地面",
    kind: "框架",
    level: "核心",
    note: "组件化飞行软件框架：端口、命令、遥测、参数与测试。",
    href: "https://github.com/nasa/fprime",
  },
  {
    title: "NASA cFS",
    author: "NASA",
    group: "通信与地面",
    kind: "框架",
    level: "核心",
    note: "核心飞行系统：应用、软件总线、调度与平台抽象。适合读架构。",
    href: "https://github.com/nasa/cFS",
  },
  {
    title: "Zephyr RTOS",
    author: "Zephyr Project",
    group: "通信与地面",
    kind: "框架",
    level: "核心",
    note: "现代 RTOS：Devicetree、网络、CAN、Rust 绑定。适合做传感器 / 阀门节点。",
    href: "https://github.com/zephyrproject-rtos/zephyr",
  },
  {
    title: "FreeRTOS Kernel",
    author: "FreeRTOS",
    group: "通信与地面",
    kind: "框架",
    level: "核心",
    note: "最广泛使用的 MCU RTOS 之一。先掌握任务、队列与优先级。",
    href: "https://github.com/FreeRTOS/FreeRTOS-Kernel",
  },
  {
    title: "RTEMS",
    author: "RTEMS",
    group: "通信与地面",
    kind: "框架",
    level: "参考",
    note: "航天常用的开源 RTOS，支持多处理器与严格实时。",
    href: "https://www.rtems.org/",
  },
  {
    title: "Eigen",
    author: "Eigen 社区",
    group: "通信与地面",
    kind: "库",
    level: "核心",
    note: "C++ 线性代数：矩阵、四元数、分解。飞控数学的默认选择。",
    href: "https://gitlab.com/libeigen/eigen",
  },
  {
    title: "OSQP",
    author: "OSQP 社区",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "嵌入式 QP 求解器，适合 MPC 与凸优化原型。",
    href: "https://github.com/osqp/osqp",
  },
  {
    title: "Clarabel",
    author: "Oxford Control",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "Rust 实现的内点法锥优化器，提供 C/C++ 接口，适合 SOCP。",
    href: "https://github.com/oxfordcontrol/Clarabel.rs",
  },
  {
    title: "CVXPYgen",
    author: "Stanford Boyd 团队",
    group: "通信与地面",
    kind: "工具",
    level: "进阶",
    note: "把参数化凸优化问题生成定制 C 求解器，适合嵌入飞控。",
    href: "https://github.com/cvxgrp/cvxpygen",
  },
  {
    title: "CasADi",
    author: "CasADi 社区",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "符号建模、自动微分与最优控制原型；acados 的常用前端。",
    href: "https://github.com/casadi/casadi",
  },
  {
    title: "FATROP",
    author: "MECO Group, KU Leuven",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "利用 OCP 稀疏结构的高效非线性求解器，适合实时 MPC 研究。",
    href: "https://github.com/meco-group/fatrop",
  },
  {
    title: "AFF3CT",
    author: "AFF3CT 社区",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "快速前向纠错仿真与实现：LDPC、Turbo、极化码。",
    href: "https://github.com/aff3ct/aff3ct",
  },
  {
    title: "GNU Radio",
    author: "GNU Radio 社区",
    group: "通信与地面",
    kind: "工具",
    level: "核心",
    note: "SDR 图形化与 C++ / Python 流图，适合做调制 / 解调原型。",
    href: "https://github.com/gnuradio/gnuradio",
  },
  {
    title: "gr-satellites",
    author: "Daniel Estévez",
    group: "通信与地面",
    kind: "工具",
    level: "进阶",
    note: "卫星遥测解码器集合，可直接学习 CCSDS / AX.25 等实战实现。",
    href: "https://github.com/daniestevez/gr-satellites",
  },
  {
    title: "liquid-dsp",
    author: "Joseph Gaeddert",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "纯 C 的轻量 DSP 库，适合嵌入固件与离线链路仿真。",
    href: "https://github.com/jgaeddert/liquid-dsp",
  },
  {
    title: "FutureSDR",
    author: "FutureSDR 社区",
    group: "通信与地面",
    kind: "框架",
    level: "进阶",
    note: "Rust 异步 SDR 运行时，多核吞吐与部署灵活性优于传统脚本流图。",
    href: "https://github.com/FutureSDR/FutureSDR",
  },
  {
    title: "Fast DDS",
    author: "eProsima",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "成熟的 DDS 实现，适合箭内发布-订阅与 QoS 控制。",
    href: "https://github.com/eProsima/Fast-DDS",
  },
  {
    title: "Eclipse Zenoh",
    author: "Eclipse Foundation",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "Rust 编写的去中心化发布-订阅 / 查询协议，提供 C/C++ 绑定，适合跨网段与无线链路。",
    href: "https://github.com/eclipse-zenoh/zenoh",
  },
  {
    title: "libcsp",
    author: "libcsp 社区",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "CubeSat Space Protocol：轻量网络层，支持 CAN、I2C、KISS、ZMQ 等接口。",
    href: "https://github.com/libcsp/libcsp",
  },
  {
    title: "nanopb",
    author: "Petteri Aimonen",
    group: "通信与地面",
    kind: "库",
    level: "核心",
    note: "为嵌入式 C 生成紧凑的 Protocol Buffers 编解码器。",
    href: "https://github.com/nanopb/nanopb",
  },
  {
    title: "FlatBuffers",
    author: "Google",
    group: "通信与地面",
    kind: "库",
    level: "进阶",
    note: "零拷贝序列化，适合高频遥测与共享内存；注意 schema 演进。",
    href: "https://github.com/google/flatbuffers",
  },
  {
    title: "Yamcs",
    author: "Yamcs 社区",
    group: "通信与地面",
    kind: "工具",
    level: "核心",
    note: "开源任务控制与遥测系统：CCSDS、参数、命令、归档与时间线。",
    href: "https://github.com/yamcs/yamcs",
  },
  {
    title: "OpenC3 COSMOS",
    author: "OpenC3",
    group: "通信与地面",
    kind: "工具",
    level: "核心",
    note: "开源指挥控制与测试工具，适合桌面级地面段与自动化测试。",
    href: "https://github.com/OpenC3/cosmos",
  },
  {
    title: "NASA Open MCT",
    author: "NASA",
    group: "通信与地面",
    kind: "工具",
    level: "核心",
    note: "Web 遥测监控与任务控制界面，适合做实时大屏与回放。",
    href: "https://github.com/nasa/openmct",
  },

  {
    title: "GoogleTest",
    author: "Google",
    group: "验证与工具",
    kind: "工具",
    level: "核心",
    note: "C++ 单元测试与 mock。飞控模块至少要有边界与故障用例。",
    href: "https://github.com/google/googletest",
  },
  {
    title: "Catch2",
    author: "Catch2 社区",
    group: "验证与工具",
    kind: "工具",
    level: "核心",
    note: "轻量 C++ 测试框架，适合嵌入式与跨平台测试。",
    href: "https://github.com/catchorg/Catch2",
  },
  {
    title: "Frama-C",
    author: "CEA / Inria",
    group: "验证与工具",
    kind: "工具",
    level: "进阶",
    note: "C 程序的形式化分析：值分析、契约、运行时验证。",
    href: "https://frama-c.com/",
  },
  {
    title: "Kani",
    author: "Kani 社区",
    group: "验证与工具",
    kind: "工具",
    level: "进阶",
    note: "Rust 的有界模型检查器，验证 panic、溢出与断言。",
    href: "https://github.com/model-checking/kani",
  },
  {
    title: "Cppcheck",
    author: "Cppcheck 社区",
    group: "验证与工具",
    kind: "工具",
    level: "核心",
    note: "C/C++ 静态分析，覆盖未定义行为、资源泄漏与常见缺陷。",
    href: "https://github.com/danmar/cppcheck",
  },
  {
    title: "Clang-Tidy",
    author: "LLVM",
    group: "验证与工具",
    kind: "工具",
    level: "核心",
    note: "可配置的 C++ 静态检查与自动修复，适合接入 CI。",
    href: "https://clang.llvm.org/extra/clang-tidy/",
  },
  {
    title: "Valgrind",
    author: "Valgrind 社区",
    group: "验证与工具",
    kind: "工具",
    level: "核心",
    note: "内存错误、泄漏与竞态检测（Helgrind）。在 x86 开发机上做回归。",
    href: "https://valgrind.org/",
  },
];
