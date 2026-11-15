export interface CoreEquation {
  title: string;
  formula: string;
  body: string;
}

export interface CoreBreakdown {
  name: string;
  detail: string;
  metrics: string[];
}

export interface CoreTradeoff {
  option: string;
  pros: string;
  cons: string;
  use: string;
}

export interface CoreFailure {
  mode: string;
  cause: string;
  mitigation: string;
}

export interface CoreReference {
  name: string;
  detail: string;
  href?: string;
}

export interface CoreResource {
  title: string;
  author: string;
  type: "书" | "标准" | "文档" | "课程" | "数据";
  level: "入门" | "核心" | "进阶" | "参考";
  note: string;
  href?: string;
}

export interface CoreProject {
  name: string;
  note: string;
  lang: string;
  href: string;
}

export interface EngineeringTopic {
  slug: string;
  index: string;
  title: string;
  en: string;
  accent: "orange" | "teal" | "gold" | "blue" | "red";
  tagline: string;
  summary: string;
  stats: { value: string; label: string; note?: string }[];
  equations: CoreEquation[];
  breakdownTitle: string;
  breakdownLead: string;
  breakdown: CoreBreakdown[];
  tradeoffTitle: string;
  tradeoffLead: string;
  tradeoffs: CoreTradeoff[];
  failureTitle: string;
  failures: CoreFailure[];
  referenceTitle: string;
  referenceLead: string;
  references: CoreReference[];
  resources: CoreResource[];
  projects: CoreProject[];
  learn: { label: string; href: string }[];
  boundaries: string;
  sources: { label: string; href: string }[];
}

export const ENGINEERING_TOPICS: EngineeringTopic[] = [
  {
    slug: "propulsion",
    index: "01",
    title: "火箭发动机",
    en: "Rocket Propulsion",
    accent: "orange",
    tagline: "把化学能变成推力，再把推力变成可重复的工程。",
    summary:
      "从推力方程、特征速度、喷管膨胀，到涡轮泵、燃烧不稳定、再生冷却与试车。发动机是热力学、流体、结构、控制与供应链的交汇点；理解它，才能判断一枚火箭的运力、复用与经济性从哪里来。",
    stats: [
      { value: "7", label: "动力架构", note: "挤压到全流量分级燃烧" },
      { value: "5", label: "推进剂家族", note: "煤油 / 甲烷 / 氢 / 肼 / 固体" },
      { value: "2", label: "设计点", note: "海平面与真空" },
      { value: "1", label: "硬约束", note: "燃烧稳定性" },
    ],
    equations: [
      {
        title: "推力方程",
        formula: "F = ṁ·v_e + (p_e − p_a)·A_e",
        body:
          "第一项是动量推力，第二项是压力推力。海平面与真空的差别不只是“有没有空气”，而是喷管出口压力与环境的匹配。",
      },
      {
        title: "比冲与有效排气速度",
        formula: "I_sp = F / (ṁ·g₀) = v_e / g₀",
        body:
          "I_sp 的单位是秒，本质是“每单位重量流量的推力”。工程比较时永远要注明海平面还是真空、含不含冷气/电力消耗。",
      },
      {
        title: "特征速度与推力系数",
        formula: "c* = p_c·A_t / ṁ    C_F = F / (p_c·A_t)    I_sp = c*·C_F / g₀",
        body:
          "c* 衡量燃烧与喉部流动的效率，C_F 衡量喷管把压力变成推力的能力。发动机优化就是同时提高这两个量，并控制重量与冷却代价。",
      },
      {
        title: "齐奥尔科夫斯基方程",
        formula: "Δv = I_sp·g₀·ln(m₀ / m_f)",
        body:
          "运力由比冲与质量比共同决定。比冲提高 5% 很贵；结构减重 5% 往往更便宜，但受材料、屈曲与制造限制。",
      },
      {
        title: "喷管面积比",
        formula: "ε = A_e / A_t    p_e = p_a 时为最佳膨胀",
        body:
          "面积比越大，真空性能越好，但海平面更容易过膨胀与流动分离。单级入轨与上面级因此使用不同的喷管。",
      },
      {
        title: "再生冷却换热（Bartz 量级）",
        formula: "h_g ∝ (p_c·c*)^0.8 / D^0.2 · (A_t/A)^0.9",
        body:
          "Bartz 相关式给出燃气侧换热系数的量级；实际设计还要乘物性、曲率/粗糙度与气膜冷却修正。通道压降、沸腾、结焦与热应力，往往比“推力够不够”更早成为瓶颈。",
      },
    ],
    breakdownTitle: "七类动力架构",
    breakdownLead:
      "架构决定压力、比冲、重量与制造难度。没有“最好”的循环，只有与任务、推进剂、复用次数和成本匹配的架构。",
    breakdown: [
      {
        name: "挤压式",
        detail: "高压气瓶把推进剂压进燃烧室，没有涡轮泵。",
        metrics: ["结构简单", "室压低", "贮箱重", "上面级 / 小型发动机"],
      },
      {
        name: "燃气发生器",
        detail: "少量推进剂驱动涡轮，废气直接排掉；Merlin、F-1 属于这一类。",
        metrics: ["成熟", "Isp 中等", "涡轮废气损失", "海平面主力"],
      },
      {
        name: "富氧分级燃烧",
        detail: "全部或大部分氧气先经过预燃室驱动涡轮，再进入主燃烧室；BE-4、RD-180 属于这一类。",
        metrics: ["高压", "无积碳", "富氧材料苛刻", "大型一级"],
      },
      {
        name: "富燃分级燃烧",
        detail: "燃料先经过预燃室；RS-25 是典型。",
        metrics: ["高 Isp", "热燃气管理复杂", "氢系统", "上面级 / 重型"],
      },
      {
        name: "全流量分级燃烧",
        detail: "氧化剂与燃料分别经过预燃室，全部燃气进入主燃烧室；Raptor 是代表。",
        metrics: ["高压", "高 Isp", "系统最复杂", "可复用一级"],
      },
      {
        name: "膨胀循环",
        detail: "用冷却套吸收的热量驱动涡轮；RL10、Vinci 属于这一类。",
        metrics: ["结构简单", "Isp 高", "推力受限", "氢氧上面级"],
      },
      {
        name: "电泵",
        detail: "电池驱动泵，取代燃气涡轮；Rutherford 是代表。",
        metrics: ["系统简单", "电池质量", "小推力", "小型运载"],
      },
    ],
    tradeoffTitle: "工程权衡",
    tradeoffLead:
      "发动机选型从来不是单指标优化。下面这些取舍，决定了运力、复用、地面操作与供应链。",
    tradeoffs: [
      {
        option: "煤油 / 甲烷 / 氢",
        pros: "煤油密度高、成熟；甲烷积碳少、冷却好；氢比冲最高。",
        cons: "煤油易结焦；甲烷需低温；氢密度低、贮箱大、泄漏难。",
        use: "煤油适合一级；甲烷兼顾复用；氢适合上面级与深空。",
      },
      {
        option: "燃气发生器 vs 分级燃烧",
        pros: "GG 简单、成本低；SC 压力与 Isp 更高。",
        cons: "GG 有涡轮废气损失；SC 热管理、材料与启动更复杂。",
        use: "成本敏感用 GG；高性能/复用用 SC 或 FFSC。",
      },
      {
        option: "固定喷管 vs 高度补偿",
        pros: "固定喷管简单可靠；气动塞/双钟形适应宽空域。",
        cons: "固定喷管只在单一高度最佳；补偿喷管冷却与结构复杂。",
        use: "多级火箭用不同面积比；单级复用需要更宽包线。",
      },
      {
        option: "再生冷却 vs 烧蚀 / 辐射",
        pros: "再生可复用；烧蚀简单、热容高；辐射适合低热流。",
        cons: "再生通道压降与结焦；烧蚀一次性；辐射面积大。",
        use: "长时/复用用再生；上面级与短时用辐射/烧蚀。",
      },
      {
        option: "万向节 vs 燃气舵 / 游动发动机",
        pros: "万向节效率高；燃气舵简单；游动发动机独立。",
        cons: "作动器与管路复杂；舵损失大；游机增加系统。",
        use: "大型发动机用万向节；小火箭可用舵/游机。",
      },
    ],
    failureTitle: "典型失效与检查点",
    failures: [
      {
        mode: "燃烧不稳定",
        cause: "喷注器与声学模态耦合，出现 chugging / buzzing / screech。",
        mitigation: "喷注器试验、隔板/声衬、阻尼器、全尺寸热试；不要只用稳态 CFD 判断。",
      },
      {
        mode: "涡轮泵汽蚀",
        cause: "入口 NPSH 不足、预冷不充分、贮箱增压失效。",
        mitigation: "诱导轮设计、入口压力预算、 chilldown 程序、快速阀时序。",
      },
      {
        mode: "轴承/密封失效",
        cause: "高速转子动力学、热膨胀、推进剂润滑不足。",
        mitigation: "转子动力学分析、试验台振动监测、密封吹除、健康监测。",
      },
      {
        mode: "喷管流动分离",
        cause: "海平面过膨胀，喷管壁面分离并产生侧向载荷。",
        mitigation: "限制面积比、主动冷却、结构加强、试车包线验证。",
      },
      {
        mode: "冷却通道烧穿",
        cause: "局部热流过高、流量分配不均、结焦或堵塞。",
        mitigation: "通道 CFD、流量试验、壁温测量、冗余冷却与材料余量。",
      },
      {
        mode: "启动/关机时序错误",
        cause: "阀门不同步、推进剂混合比越界、点火能量不足。",
        mitigation: "时序仿真、硬件在环、火药/火花点火冗余、紧急关机逻辑。",
      },
    ],
    referenceTitle: "参考发动机",
    referenceLead:
      "公开参数随型号批次与测试条件变化，下表只用于建立“循环—推进剂—应用”的对应关系，不作为选型数据表。",
    references: [
      { name: "Merlin 1D", detail: "煤油/液氧，燃气发生器，Falcon 9 一级。" },
      { name: "Raptor", detail: "甲烷/液氧，全流量分级燃烧，Starship。" },
      { name: "BE-4", detail: "甲烷/液氧，富氧分级燃烧，New Glenn / Vulcan。" },
      { name: "RS-25", detail: "氢/液氧，富燃分级燃烧，SLS 核心级。" },
      { name: "RD-180", detail: "煤油/液氧，富氧分级燃烧，Atlas V。" },
      { name: "F-1", detail: "煤油/液氧，燃气发生器，Saturn V 一级。" },
      { name: "RL10 / Vinci", detail: "氢/液氧，膨胀循环，上面级。" },
      { name: "Rutherford / Archimedes", detail: "电动泵小发动机 / 甲烷富氧分级燃烧，Electron / Neutron。" },
    ],
    resources: [
      { title: "Rocket Propulsion Elements", author: "Sutton & Biblarz", type: "书", level: "核心", note: "推进入门与工程参数的标准教材。" },
      { title: "Modern Engineering for Design of Liquid-Propellant Rocket Engines", author: "Huzel & Huang", type: "书", level: "进阶", note: "泵、阀门、推力室与系统设计的工程手册。" },
      { title: "Combustion Instabilities in Liquid Rocket Engines", author: "Yang & Anderson", type: "书", level: "进阶", note: "燃烧不稳定机理、试验与抑制。" },
      { title: "Turbopump Systems for Liquid Rocket Engines", author: "NASA SP-8107", type: "文档", level: "进阶", note: "涡轮泵、汽蚀、轴承与密封的经典 NASA 文档。" },
      { title: "NASA CEA", author: "NASA Glenn", type: "数据", level: "核心", note: "化学平衡与火箭性能计算，推进剂配比的第一站。", href: "https://cearun.grc.nasa.gov/" },
      { title: "RocketCEA", author: "NASA", type: "文档", level: "核心", note: "CEA 的 Python 封装，适合批量扫描与优化。", href: "https://pypi.org/project/rocketcea/" },
      { title: "Cantera", author: "Cantera 社区", type: "文档", level: "进阶", note: "化学反应动力学、燃烧与输运计算。", href: "https://cantera.org/" },
      { title: "RPA", author: "Rocket Propulsion Analysis", type: "文档", level: "进阶", note: "推力室与喷管性能估算工具（免费使用，非开源）。", href: "https://www.rocket-propulsion.com/" },
      { title: "RocketPy", author: "RocketPy Team", type: "文档", level: "核心", note: "探空火箭弹道与推进建模，可与 CEA 结果联动。", href: "https://github.com/RocketPy-Team/RocketPy" },
      { title: "OpenRocket", author: "OpenRocket 社区", type: "文档", level: "入门", note: "模型火箭设计与稳定性/弹道快速估算。", href: "https://openrocket.info/" },
      { title: "SU2", author: "SU2 社区", type: "文档", level: "进阶", note: "可压缩/高超声速 CFD 与伴随优化。", href: "https://su2code.github.io/" },
      { title: "OpenFOAM", author: "OpenFOAM 社区", type: "文档", level: "进阶", note: "燃烧、传热与喷管 CFD。", href: "https://www.openfoam.com/" },
      { title: "pyCycle", author: "OpenMDAO / NASA", type: "文档", level: "进阶", note: "热力学循环建模，适合发动机循环参数扫描。", href: "https://github.com/OpenMDAO/pyCycle" },
    ],
    projects: [
      { name: "NASA CEA", note: "化学平衡与理论性能。", lang: "Fortran / Web", href: "https://cearun.grc.nasa.gov/" },
      { name: "RocketCEA", note: "Python 批量 CEA。", lang: "Python", href: "https://pypi.org/project/rocketcea/" },
      { name: "Cantera", note: "反应流与燃烧动力学。", lang: "C++ / Python", href: "https://cantera.org/" },
      { name: "RocketPy", note: "探空火箭六自由度。", lang: "Python", href: "https://github.com/RocketPy-Team/RocketPy" },
      { name: "OpenRocket", note: "模型火箭设计与仿真。", lang: "Java", href: "https://openrocket.info/" },
      { name: "SU2", note: "可压缩 CFD 与伴随优化。", lang: "C++", href: "https://su2code.github.io/" },
      { name: "OpenFOAM", note: "燃烧、传热与喷管 CFD。", lang: "C++", href: "https://www.openfoam.com/" },
      { name: "pyCycle", note: "发动机循环热力学。", lang: "Python", href: "https://github.com/OpenMDAO/pyCycle" },
      { name: "CoolProp", note: "推进剂与低温流体物性。", lang: "C++ / Python", href: "https://coolprop.org/" },
    ],
    learn: [
      { label: "阶段 01 · 飞行动力学", href: "/roadmap/#dynamics" },
      { label: "C/C++ 工程 · 实时系统", href: "/flight-software/#realtime" },
      { label: "项目 05 · 推力矢量台架", href: "/projects/#tvc" },
    ],
    boundaries:
      "本页不提供推进剂配方、点火程序、发动机设计参数或试车操作指南。公开性能数据受型号批次、喷管面积比、测试环境与测量方法影响；任何真实发动机工作都涉及高风险与法规约束。",
    sources: [
      { label: "NASA CEA", href: "https://cearun.grc.nasa.gov/" },
      { label: "RocketCEA", href: "https://pypi.org/project/rocketcea/" },
      { label: "Cantera", href: "https://cantera.org/" },
      { label: "RPA", href: "https://www.rocket-propulsion.com/" },
      { label: "RocketPy", href: "https://github.com/RocketPy-Team/RocketPy" },
      { label: "OpenRocket", href: "https://openrocket.info/" },
      { label: "SU2", href: "https://su2code.github.io/" },
      { label: "OpenFOAM", href: "https://www.openfoam.com/" },
    ],
  },
  {
    slug: "spacecraft",
    index: "02",
    title: "太空飞船",
    en: "Spacecraft Systems",
    accent: "teal",
    tagline: "十个子系统，在五类预算下互相拉扯。",
    summary:
      "飞船不是单一机器，而是载荷、结构、电源、热控、姿控、数管、测控、推进、生命保障与再入/对接等子系统在质量、功率、热、数据与可靠性预算下的妥协。设计一艘飞船，本质上是在做一场持续数年的多目标优化。",
    stats: [
      { value: "10", label: "核心子系统", note: "从结构到 ECLSS" },
      { value: "3", label: "硬预算", note: "质量 / 功率 / 热" },
      { value: "2", label: "环境", note: "近地 / 深空" },
      { value: "1", label: "安全底线", note: "FDIR 与失效保护" },
    ],
    equations: [
      {
        title: "刚体姿态动力学",
        formula: "I·ω̇ + ω × (I·ω) = τ",
        body:
          "姿态控制的核心不是“把角度调零”，而是管理角动量、扰动力矩与执行机构饱和。帆板、重力梯度、气动与推力偏心都会持续注入角动量。",
      },
      {
        title: "动量轮角动量",
        formula: "h = I_w·Ω    τ = −ḣ",
        body:
          "轮子通过交换角动量控制星体；磁力矩器或推力器负责卸载。轮子饱和是低轨卫星最常见的“姿态紧急状态”之一。",
      },
      {
        title: "热平衡",
        formula: "Q_solar + Q_internal + Q_aero = Q_rad + Q_stored",
        body:
          "热控不是“加加热器”，而是让每个部件在允许温度带内工作。Q_stored = m·c_p·dT/dt；深空没有对流，辐射是唯一的主要外部散热路径。",
      },
      {
        title: "太阳翼功率",
        formula: "P = G·A·η·cos θ · degradation",
        body:
          "光照期给载荷供电并充电，阴影期靠电池。轨道高度、姿态、太阳距离与电池 DoD 决定电源系统的质量。",
      },
      {
        title: "链路方程",
        formula: "P_r = P_t·G_t·G_r·(λ / 4πd)²",
        body:
          "链路预算要同时考虑发射功率、天线增益、距离、频率、噪声与调制门限。深空链路常常受限于航天器功率与天线口径。",
      },
      {
        title: "质量预算",
        formula: "m₀ = m_dry + m_prop\nm_dry = m_struct + m_power + m_thermal + m_avionics + m_payload + margin",
        body:
          "干重、推进剂、载荷与余量必须分开管理。每个子系统都要有最坏情况估算与成长余量；质量失控通常不是某一个零件，而是几十个“小超重”。",
      },
      {
        title: "可靠性串联模型",
        formula: "R = exp(−λ·t)    R_system = Π R_i",
        body:
          "单点失效会直接拉低整星可靠度。冗余、降级模式与 FDIR 的价值，必须用故障树与在轨数据来证明。",
      },
    ],
    breakdownTitle: "十个核心子系统",
    breakdownLead:
      "每个子系统都有自己的预算与失效模式，但它们共享同一组质量、功率、热与数据接口。系统工程的难点是让它们同时闭合。",
    breakdown: [
      { name: "载荷", detail: "相机、雷达、通信、科学仪器；决定轨道、姿态精度与数据率。", metrics: ["分辨率", "带宽", "指向精度", "热稳定"] },
      { name: "结构", detail: "承力筒、板、支架、适配器；把发射载荷传到主结构。", metrics: ["基频", "屈曲", "质量", "接口"] },
      { name: "电源", detail: "太阳翼、电池、PCU、配电器；决定阴影期与峰值负载能力。", metrics: ["W/kg", "DoD", "母线", "效率"] },
      { name: "热控", detail: "MLI、散热面、热管、加热器、百叶窗；维持部件温度。", metrics: ["温度带", "散热", "热耦合", "余量"] },
      { name: "姿控", detail: "星敏、陀螺、太阳敏感器、动量轮、磁力矩器、推力器。", metrics: ["指向", "稳定度", "角动量", "控制模式"] },
      { name: "数管", detail: "星载计算机、总线、存储、时间同步、软件。", metrics: ["算力", "冗余", "总线", "抗辐射"] },
      { name: "测控", detail: "S/X/Ka 波段、天线、收发信机、测距与遥测。", metrics: ["EIRP", "G/T", "数据率", "覆盖"] },
      { name: "推进", detail: "化学/电推进、贮箱、阀门、推力器；用于入轨、保持与姿控。", metrics: ["Δv", "Isp", "推力", "贮箱"] },
      { name: "生命保障", detail: "氧气、二氧化碳、水、压力、温湿度与废物管理。", metrics: ["闭环度", "冗余", "消耗品", "安全"] },
      { name: "再入/对接", detail: "热防护、降落伞、反推、对接机构与敏感器。", metrics: ["β", "L/D", "接口", "捕获"] },
    ],
    tradeoffTitle: "总体权衡",
    tradeoffLead:
      "飞船的总体方案往往由一两个“不可让步”的约束决定：载人安全、发射包络、寿命、成本或数据率。",
    tradeoffs: [
      { option: "单体 vs 模块化", pros: "单体轻、接口少；模块化易扩展、易维修。", cons: "单体升级困难；模块化增加结构与接口质量。", use: "小卫星偏单体；空间站/大型平台偏模块化。" },
      { option: "载人 vs 无人", pros: "载人可现场决策、带回样本；无人成本低、风险可控。", cons: "载人需要 ECLSS、逃逸、认证与巨大冗余。", use: "科学/通信多无人；探月/空间站载人。" },
      { option: "一次性 vs 可复用", pros: "一次性简单、质量效率高；可复用降低单次成本。", cons: "一次性成本高；复用需要热防护、检查与翻修。", use: "高能上面级一次性；近地运输可复用。" },
      { option: "集中式 vs 分布式航电", pros: "集中式重量低；分布式隔离好、易扩展。", cons: "集中式单点风险；分布式线缆与同步复杂。", use: "小卫星集中；大型平台分布式/分区。" },
      { option: "RTOS vs Linux", pros: "RTOS 确定性强；Linux 生态与算力好。", cons: "RTOS 生态小；Linux 需 PREEMPT_RT 与分区。", use: "硬实时控制用 RTOS；高算力载荷/主计算机用 RT Linux。" },
    ],
    failureTitle: "典型失效与检查点",
    failures: [
      { mode: "电源耗尽", cause: "阴影期过长、负载超预算、电池退化或太阳翼指向错误。", mitigation: "功率预算、低电量安全模式、负载优先级、电池健康监测。" },
      { mode: "热失控", cause: "散热不足、热耦合错误、加热器卡死或太阳照射异常。", mitigation: "热平衡试验、温度遥测、加热器 watchdog、冗余散热路径。" },
      { mode: "姿态丢失", cause: "星敏致盲、陀螺漂移、轮子饱和、控制参数错误。", mitigation: "多源姿态估计、轮子卸载、安全模式、太阳捕获。" },
      { mode: "推进剂泄漏", cause: "阀门密封失效、焊缝/管路缺陷、微流星撞击。", mitigation: "泄漏测试、隔离阀、压力监测、推进系统分区。" },
      { mode: "辐射单粒子", cause: "高能粒子翻转存储器/逻辑，导致复位或错误指令。", mitigation: "ECC、看门狗、TMR、辐射加固器件、EDAC。" },
      { mode: "对接失败", cause: "相对导航误差、接口不同步、捕获机构卡滞。", mitigation: "多传感器融合、IDSS 兼容、地面/HIL 演练、手动备份。" },
    ],
    referenceTitle: "参考飞船",
    referenceLead:
      "不同飞船代表不同的总体取舍：乘员运输、货运、深空、复用、着陆。对比它们比记参数更有价值。",
    references: [
      { name: "Orion", detail: "NASA 深空载人飞船，Lockheed Martin 主承包；Artemis II 首次载人绕月。" },
      { name: "Crew Dragon", detail: "SpaceX 可复用载人飞船，服务 ISS；集成发射逃逸与海面溅落。" },
      { name: "Starliner", detail: "Boeing 载人飞船，4 人级；2026 年仍未取得载人认证。" },
      { name: "Cygnus", detail: "Northrop Grumman 货运飞船，ISS 补给。" },
      { name: "Starship", detail: "SpaceX 全复用超重型飞船，目标近地/月球/火星。" },
      { name: "Blue Moon", detail: "Blue Origin 月面着陆器，MK1 货运、MK2 载人。" },
      { name: "ISS", detail: "多国合作空间站，模块化、长期在轨、复杂 ECLSS。" },
      { name: "Voyager", detail: "深空探测器，极端通信链路与长寿命设计。" },
    ],
    resources: [
      { title: "Space Mission Analysis and Design (SMAD)", author: "Wertz & Larson", type: "书", level: "核心", note: "任务设计、预算与总体权衡的经典。" },
      { title: "Spacecraft Systems Engineering", author: "Fortescue, Swinerd & Stark", type: "书", level: "核心", note: "飞船各子系统的系统教材。" },
      { title: "Spacecraft Attitude Determination and Control", author: "Wertz", type: "书", level: "进阶", note: "姿态确定与控制的经典参考。" },
      { title: "NASA Systems Engineering Handbook", author: "NASA", type: "标准", level: "核心", note: "需求、接口、验证与评审流程。", href: "https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf" },
      { title: "ECSS 标准体系", author: "ECSS", type: "标准", level: "参考", note: "欧洲航天系统与软件工程标准。", href: "https://ecss.nl/" },
      { title: "NASA cFS", author: "NASA", type: "文档", level: "核心", note: "核心飞行系统：应用、软件总线与调度。", href: "https://github.com/nasa/cFS" },
      { title: "NASA F´", author: "NASA JPL", type: "文档", level: "核心", note: "组件化飞行软件框架。", href: "https://github.com/nasa/fprime" },
      { title: "Basilisk", author: "AVS Lab", type: "文档", level: "进阶", note: "航天器 GNC 与动力学仿真框架。", href: "https://github.com/AVSLab/basilisk" },
      { title: "NOS3", author: "NASA", type: "文档", level: "进阶", note: "NASA 开源航天器仿真与飞控软件栈。", href: "https://github.com/nasa/nos3" },
      { title: "Open MCT", author: "NASA", type: "文档", level: "核心", note: "任务控制与遥测可视化。", href: "https://nasa.github.io/openmct/" },
      { title: "42", author: "Eric Stoneking", type: "文档", level: "进阶", note: "航天器姿态与轨道仿真框架。", href: "https://github.com/ericstoneking/42" },
      { title: "SPICE", author: "NASA NAIF", type: "数据", level: "核心", note: "星历、姿态、时间与参考系工具。", href: "https://naif.jpl.nasa.gov/naif/" },
    ],
    projects: [
      { name: "NASA cFS", note: "核心飞行系统。", lang: "C", href: "https://github.com/nasa/cFS" },
      { name: "NASA F´", note: "组件化飞控框架。", lang: "C++", href: "https://github.com/nasa/fprime" },
      { name: "Basilisk", note: "GNC 与航天器仿真。", lang: "C++ / Python", href: "https://github.com/AVSLab/basilisk" },
      { name: "NOS3", note: "端到端航天器仿真。", lang: "C / Python", href: "https://github.com/nasa/nos3" },
      { name: "Open MCT", note: "任务控制可视化。", lang: "JavaScript", href: "https://nasa.github.io/openmct/" },
      { name: "42", note: "姿态/轨道仿真。", lang: "C++", href: "https://github.com/ericstoneking/42" },
      { name: "Orekit", note: "轨道与时间系统库。", lang: "Java", href: "https://www.orekit.org/" },
      { name: "SPICE", note: "星历与几何。", lang: "C / Python", href: "https://naif.jpl.nasa.gov/naif/" },
      { name: "GMAT", note: "任务分析与轨道设计。", lang: "C++", href: "https://gmat.sourceforge.net/" },
    ],
    learn: [
      { label: "阶段 05 · 系统集成与验证", href: "/roadmap/#systems" },
      { label: "知识域 · 系统工程", href: "/fundamentals/#systems" },
      { label: "C/C++ 工程 · 容错与 HIL", href: "/flight-software/#verification" },
    ],
    boundaries:
      "载人飞船的认证、生命保障与故障管理细节通常受出口控制与商业保密限制；本页只使用公开任务资料、标准与开源软件，不构成设计或安全认证依据。",
    sources: [
      { label: "NASA SE Handbook", href: "https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf" },
      { label: "ECSS", href: "https://ecss.nl/" },
      { label: "NASA cFS", href: "https://github.com/nasa/cFS" },
      { label: "NASA F´", href: "https://github.com/nasa/fprime" },
      { label: "Basilisk", href: "https://github.com/AVSLab/basilisk" },
      { label: "NOS3", href: "https://github.com/nasa/nos3" },
      { label: "Open MCT", href: "https://nasa.github.io/openmct/" },
      { label: "SPICE", href: "https://naif.jpl.nasa.gov/naif/" },
    ],
  },
  {
    slug: "orbits",
    index: "03",
    title: "太空轨道",
    en: "Orbital Mechanics",
    accent: "blue",
    tagline: "轨道不是一条线，而是能量、动量与时间的故事。",
    summary:
      "从二体问题、轨道要素与 vis-viva，到霍曼转移、平面变化、交会、J2 摄动、星座与行星际转移。轨道力学是把“去哪、什么时候到、要多少 Δv”变成可计算问题的语言。",
    stats: [
      { value: "6", label: "轨道要素", note: "a e i Ω ω ν" },
      { value: "4", label: "主要环境", note: "LEO / MEO / GEO / HEO" },
      { value: "2", label: "模型层级", note: "二体 + 摄动" },
      { value: "1", label: "核心预算", note: "Δv" },
    ],
    equations: [
      {
        title: "二体运动方程",
        formula: "r̈ = −μ·r / |r|³",
        body:
          "μ 是中心天体引力常数。二体解给出圆锥曲线；真实任务在此之上叠加 J2、大气、太阳光压与第三体摄动。",
      },
      {
        title: "vis-viva 方程",
        formula: "v² = μ·(2/r − 1/a)",
        body:
          "速度、半径与半长轴的关系。它解释了为什么“抬高远地点”要在近地点加速，以及为什么圆轨道速度随高度下降。",
      },
      {
        title: "轨道周期",
        formula: "T = 2π·√(a³/μ)",
        body:
          "周期只由半长轴决定。星座的回归、重复地面轨迹与相位保持都从这里出发。",
      },
      {
        title: "霍曼转移",
        formula: "Δv₁ = √(μ/r₁)·(√(2r₂/(r₁+r₂)) − 1)\nΔv₂ = √(μ/r₂)·(1 − √(2r₁/(r₁+r₂)))",
        body:
          "两个共面圆轨道之间的最小双脉冲转移。实际任务还要考虑点火损失、窗口与相位。",
      },
      {
        title: "平面变化",
        formula: "Δv = 2·v·sin(Δi/2)",
        body:
          "在低速点做大角度平面变化最省；这就是为什么星座部署常在远地点或低速段做机动。",
      },
      {
        title: "J2 节点进动",
        formula: "Ω̇ ≈ −(3/2)·J₂·(R_e/p)²·n·cos i",
        body:
          "J2 让轨道面缓慢进动。太阳同步轨道正是利用它来保持光照角；冻结轨道则让近地点幅角稳定。",
      },
    ],
    breakdownTitle: "轨道环境与任务类型",
    breakdownLead:
      "轨道选择由覆盖、光照、发射场、链路、寿命与碎片环境共同决定。下面是最常见的几类任务轨道。",
    breakdown: [
      { name: "LEO", detail: "160–2,000 km，低延迟、高分辨率，但大气阻力与碎片密集。", metrics: ["7.8 km/s", "90–120 min", "低成本", "寿命短"] },
      { name: "SSO", detail: "太阳同步，近极轨，固定地方时；遥感常用。", metrics: ["~98°", "光照稳定", "回归", "发射窗口"] },
      { name: "MEO", detail: "2,000–35,786 km，导航星座（GPS/Galileo）主战场。", metrics: ["12 h", "覆盖", "辐射带", "星座"] },
      { name: "GEO", detail: "35,786 km 圆轨道，相对地面静止；通信/气象。", metrics: ["24 h", "0° 倾角", "链路", "站保"] },
      { name: "Molniya", detail: "大偏心率、高倾角，长时间覆盖高纬。", metrics: ["12 h", "远地点", "高纬", "辐射带"] },
      { name: "NRHO", detail: "近直线晕轨道，Gateway/月球门户曾计划使用。", metrics: ["月球", "周期", "稳定性", "交会"] },
      { name: "L1 / L2", detail: "日地拉格朗日点，适合太阳观测与深空望远镜。", metrics: ["晕轨道", "热环境", "通信", "站保"] },
      { name: "Walker 星座", detail: "多个轨道面 + 相位角，平衡覆盖、重访与成本；Starlink/GPS 常用。", metrics: ["高度", "倾角", "面数", "相位"] },
      { name: "行星际", detail: "逃逸、转移、捕获与借力；由发射窗口与 C3 决定。", metrics: ["C3", "V∞", "窗口", "借力"] },
    ],
    tradeoffTitle: "轨道与任务权衡",
    tradeoffLead:
      "轨道设计不是“选一个高度”，而是在覆盖、运力、寿命、链路与碎片之间做取舍。",
    tradeoffs: [
      { option: "低轨 vs 高轨", pros: "低轨分辨率高、延迟低；高轨覆盖广、站保少。", cons: "低轨阻力大、寿命短；高轨辐射强、发射贵。", use: "遥感/星座低轨；通信/气象高轨。" },
      { option: "低倾角 vs 极轨", pros: "低倾角发射运力高；极轨覆盖全球。", cons: "低倾角覆盖受限；极轨发射损失大。", use: "GEO 低倾角；遥感/气象极轨。" },
      { option: "化学 vs 电推进", pros: "化学快、推力大；电推进比冲高、省质量。", cons: "化学耗推进剂；电推进时间长、功率大。", use: "快速转移/入轨化学；站保/深空电推进。" },
      { option: "单星 vs 星座", pros: "单星简单；星座覆盖/重访好。", cons: "单星覆盖有限；星座部署与运维复杂。", use: "高价值单星；通信/导航/遥感星座。" },
      { option: "主动离轨 vs 自然衰减", pros: "主动可靠、时间可控；自然衰减省推进剂。", cons: "主动需推进/成本；自然受太阳活动影响。", use: "低轨寿命末期主动离轨；高轨墓地轨道。" },
    ],
    failureTitle: "轨道任务常见失效",
    failures: [
      { mode: "发射入轨偏差", cause: "上面级关机误差、入轨点偏差、质量/推力偏差。", mitigation: "入轨精度预算、上面级重启、卫星自主修正。" },
      { mode: "交会失败", cause: "相位误差、相对导航误差、窗口错过。", mitigation: "多圈相位调整、CW/ Lambert 复核、备份窗口。" },
      { mode: "站保耗尽", cause: "推进剂预算不足、推力器退化、控制律效率低。", mitigation: "Δv 预算、冗余推力器、优化站保策略。" },
      { mode: "碰撞风险", cause: "碎片编目误差、机动延迟、星座密集。", mitigation: " conjunction assessment、自动避碰、低轨寿命设计。" },
      { mode: "共振/进动失控", cause: "J2、第三体、太阳光压导致轨道要素长期漂移。", mitigation: "冻结轨道、站保周期、长期传播与蒙特卡洛。" },
      { mode: "离轨失败", cause: "推进系统故障、剩余 Δv 不足、再入界面角错误。", mitigation: "被动离轨设计、寿命末期检查、可控再入。" },
    ],
    referenceTitle: "参考任务与轨道",
    referenceLead:
      "把轨道参数与任务目标对应起来，比孤立记公式更有用。",
    references: [
      { name: "Starlink", detail: "低轨通信星座，多壳层、频繁站保与离轨。" },
      { name: "GPS / Galileo", detail: "MEO 导航星座，Walker 构型与高精度时钟。" },
      { name: "GOES / 气象卫星", detail: "GEO 气象观测，长期站保与姿态稳定。" },
      { name: "Molniya", detail: "高纬通信的大偏心率轨道。" },
      { name: "Artemis / Gateway", detail: "NRHO 与月球附近交会；2026 年 Gateway 当前形态暂停。" },
      { name: "JWST", detail: "日地 L2 晕轨道，遮阳罩与深空通信。" },
      { name: "Voyager / New Horizons", detail: "行星际逃逸、借力与深空导航。" },
    ],
    resources: [
      { title: "Fundamentals of Astrodynamics and Applications", author: "Vallado", type: "书", level: "参考", note: "轨道力学、坐标系与任务设计的标准参考。" },
      { title: "Fundamentals of Astrodynamics", author: "Bate, Mueller & White", type: "书", level: "核心", note: "二体、机动与转移的经典教材。" },
      { title: "Orbital Mechanics for Engineering Students", author: "Curtis", type: "书", level: "核心", note: "工程导向的轨道力学入门。" },
      { title: "Analytical Mechanics of Space Systems", author: "Schaub & Junkins", type: "书", level: "进阶", note: "姿态、轨道与解析力学。" },
      { title: "GMAT", author: "NASA", type: "文档", level: "核心", note: "任务分析、轨道设计与可视化。", href: "https://gmat.sourceforge.net/" },
      { title: "Orekit", author: "CS Group", type: "文档", level: "进阶", note: "工业级轨道、时间与事件检测库。", href: "https://www.orekit.org/" },
      { title: "Tudat", author: "TU Delft", type: "文档", level: "进阶", note: "天体力学与任务分析框架。", href: "https://tudat.tudelft.nl/" },
      { title: "Basilisk", author: "AVS Lab", type: "文档", level: "进阶", note: "轨道/姿态/任务仿真。", href: "https://github.com/AVSLab/basilisk" },
      { title: "SPICE", author: "NASA NAIF", type: "数据", level: "核心", note: "星历、参考系与时间。", href: "https://naif.jpl.nasa.gov/naif/" },
      { title: "Astropy", author: "Astropy 社区", type: "文档", level: "核心", note: "坐标、时间与单位。", href: "https://www.astropy.org/" },
      { title: "Skyfield", author: "Brandon Rhodes", type: "文档", level: "入门", note: "高精度星历与卫星跟踪。", href: "https://rhodesmill.org/skyfield/" },
      { title: "Celestrak", author: "CelesTrak", type: "数据", level: "核心", note: "TLE、轨道编目与接近事件数据。", href: "https://celestrak.org/" },
      { title: "JPL Horizons", author: "NASA JPL", type: "数据", level: "核心", note: "高精度星历与观测几何。", href: "https://ssd.jpl.nasa.gov/horizons/" },
    ],
    projects: [
      { name: "GMAT", note: "任务分析与轨道设计。", lang: "C++", href: "https://gmat.sourceforge.net/" },
      { name: "Orekit", note: "轨道与事件检测。", lang: "Java", href: "https://www.orekit.org/" },
      { name: "Tudat", note: "天体力学与估计。", lang: "C++", href: "https://tudat.tudelft.nl/" },
      { name: "Basilisk", note: "GNC/轨道仿真。", lang: "C++ / Python", href: "https://github.com/AVSLab/basilisk" },
      { name: "SPICE", note: "星历与几何。", lang: "C / Python", href: "https://naif.jpl.nasa.gov/naif/" },
      { name: "Skyfield", note: "卫星与天体位置。", lang: "Python", href: "https://rhodesmill.org/skyfield/" },
      { name: "Celestrak", note: "TLE 与轨道数据。", lang: "数据", href: "https://celestrak.org/" },
      { name: "poliastro", note: "Python 轨道力学（维护放缓）。", lang: "Python", href: "https://github.com/poliastro/poliastro" },
    ],
    learn: [
      { label: "阶段 03 · 导航与制导", href: "/roadmap/#gnc" },
      { label: "项目 08 · 二维制导闭环", href: "/projects/#guidance-2d" },
      { label: "C/C++ 工程 · GNC", href: "/flight-software/#gnc" },
    ],
    boundaries:
      "TLE 精度有限，低轨物体在数天内即可显著漂移；任务设计必须使用新鲜星历、正确的时间系统与摄动模型。本页不提供碰撞规避或发射窗口的实时决策。",
    sources: [
      { label: "GMAT", href: "https://gmat.sourceforge.net/" },
      { label: "Orekit", href: "https://www.orekit.org/" },
      { label: "Tudat", href: "https://tudat.tudelft.nl/" },
      { label: "Basilisk", href: "https://github.com/AVSLab/basilisk" },
      { label: "SPICE", href: "https://naif.jpl.nasa.gov/naif/" },
      { label: "Astropy", href: "https://www.astropy.org/" },
      { label: "Skyfield", href: "https://rhodesmill.org/skyfield/" },
      { label: "Celestrak", href: "https://celestrak.org/" },
    ],
  },
  {
    slug: "reentry",
    index: "04",
    title: "再入与热防护",
    en: "Reentry & TPS",
    accent: "red",
    tagline: "从轨道回来，是在几分钟内把动能变成热。",
    summary:
      "再入不是“掉下来”，而是一场气动、热、结构与制导的联合约束。弹道系数、进入角、升力、热流与热载决定你是被烧穿、被压垮，还是准确落在回收区。",
    stats: [
      { value: "3", label: "进入方式", note: "弹道 / 升力 / 跳跃" },
      { value: "2", label: "热流路径", note: "对流 / 辐射" },
      { value: "1", label: "质量杀手", note: "TPS 质量分数" },
      { value: "0.1–10", label: "MW/m² 热流", note: "再入驻点量级" },
    ],
    equations: [
      {
        title: "弹道系数",
        formula: "β = m / (C_d·A)",
        body:
          "β 越大，穿透大气越深、减速越晚；β 越小，减速越早但热流与过载更集中。它决定了进入走廊的宽窄。",
      },
      {
        title: "驻点热流（Sutton-Graves）",
        formula: "q_s = k·√(ρ/R_n)·v³",
        body:
          "热流随速度三次方增长、随钝头半径平方根下降。这就是为什么再入体通常是钝头，而不是尖头。",
      },
      {
        title: "总热载",
        formula: "Q = ∫ q(t) dt",
        body:
          "热流决定“温度有多高”，热载决定“TPS 要烧掉/吸收多少能量”。两者不能互相替代。",
      },
      {
        title: "升阻比与航程",
        formula: "L/D = C_L/C_D    Range ≈ f(L/D, v, altitude)",
        body:
          "升力体/航天飞机通过升力与倾侧角控制航程与落点；弹道胶囊则牺牲横向机动换取简单与轻量。",
      },
      {
        title: "等离子体频率",
        formula: "f_p ≈ 8.98·√(n_e)  Hz",
        body:
          "n_e 为电子数密度，单位 m⁻³。当等离子体频率高于通信频率，信号被反射/吸收，形成“黑障”。中继、更高频段或特殊天线布局可以缓解。",
      },
      {
        title: "进入走廊",
        formula: "γ_min < γ < γ_max",
        body:
          "太浅会跳出大气，太陡会过载/过热。进入角与升力调制共同决定走廊。",
      },
    ],
    breakdownTitle: "进入方式与 TPS 类型",
    breakdownLead:
      "从阿波罗胶囊到航天飞机，再到 Starship 与充气减速器，再入方案的核心差异在 L/D、β、TPS 与着陆方式。",
    breakdown: [
      { name: "弹道胶囊", detail: "低 L/D、钝头、烧蚀 TPS；Apollo、Soyuz、Dragon。" , metrics: ["简单", "高过载", "烧蚀", "溅落"] },
      { name: "升力体", detail: "有升力、可控制航程；航天飞机、X-37B。" , metrics: ["L/D", "热结构", "跑道", "复用"] },
      { name: "气壳 + 降落伞", detail: "火星/地球进入常用；MSL、Perseverance。" , metrics: ["超声速", "伞", "着陆", "精度"] },
      { name: "充气减速器", detail: "增大面积、降低 β；LOFTID、IRVE。" , metrics: ["轻量", "大体积", "柔性", "热"] },
      { name: "反推着陆", detail: "用发动机减速与着陆；Starship、Falcon 9 一级。" , metrics: ["推进剂", "节流", "复用", "控制"] },
      { name: "跳跃式再入", detail: "利用升力跳出再进入，延长航程/散热；Apollo 曾用。" , metrics: ["航程", "热载", "窗口", "控制"] },
      { name: "烧蚀 TPS", detail: "PICA、AVCOAT、SLA-561 等；靠热解、炭化、升华与边界层吹除带走热量。" , metrics: ["一次性", "高焓", "质量", "形状"] },
      { name: "陶瓷瓦", detail: "LI-900/LI-2200 等低密度隔热瓦；航天飞机与部分复用飞行器。" , metrics: ["低密度", "脆性", "粘接", "防水"] },
      { name: "RCC / CMC", detail: "碳-碳与陶瓷基复合材料；高温强度好，但抗氧化与连接是难点。" , metrics: ["高温", "氧化", "连接", "成本"] },
      { name: "金属/柔性 TPS", detail: "金属热结构、柔性隔热毯、充气结构；适合大面积与可展开。" , metrics: ["可展开", "面积", "维护", "热匹配"] },
    ],
    tradeoffTitle: "再入方案权衡",
    tradeoffLead:
      "再入设计没有免费选项：更低的热流往往意味着更大的面积、更重的 TPS 或更复杂的控制。",
    tradeoffs: [
      { option: "烧蚀 vs 可复用", pros: "烧蚀简单、热容高；可复用降低单次成本。", cons: "烧蚀一次性、污染；可复用需 inspection、脆性 tiles。", use: "高能/深空烧蚀；近地复用陶瓷/金属。" },
      { option: "弹道 vs 升力", pros: "弹道简单、轻；升力可控航程、低过载。", cons: "弹道过载高、落点散布大；升力结构/热复杂。", use: "货运/载人胶囊弹道；航天飞机/升力体。" },
      { option: "降落伞 vs 反推", pros: "伞轻、成熟；反推精确、可复用。", cons: "伞受超声速/风影响；反推需推进剂与控制。", use: "一次性再入伞降；复用/精确着陆反推。" },
      { option: "钝头 vs 尖头", pros: "钝头热流低、稳定；尖头阻力小。", cons: "钝头阻力大；尖头热流极高。", use: "再入体几乎都钝头；高超声速飞行器另论。" },
      { option: "低 β vs 高 β", pros: "低 β 减速早、热流低；高 β 穿透强、时间短。", cons: "低 β 面积大、易受风；高 β 热载/过载高。", use: "火星/高空低 β；小型弹道体高 β。" },
    ],
    failureTitle: "再入典型失效",
    failures: [
      { mode: "TPS 局部烧穿", cause: "缝隙、安装损伤、冲击破坏、热短路。", mitigation: "严格 inspection、缝隙密封、备份隔热、飞行前成像。" },
      { mode: "降落伞失效", cause: "超声速开伞载荷、缠绕、解锁失败。", mitigation: "减速伞分级、结构试验、冗余解锁、空投测试。" },
      { mode: "反推不稳定", cause: "发动机节流/气动耦合、推进剂晃动、控制延迟。", mitigation: "HIL 闭环、节流包线、晃动抑制、冗余点火。" },
      { mode: "制导发散", cause: "气动系数偏差、风、导航误差、执行机构饱和。", mitigation: "蒙特卡洛、鲁棒制导、在线辨识、边界保护。" },
      { mode: "通信黑障", cause: "等离子体鞘层反射/吸收信号。", mitigation: "中继、频率选择、天线位置、延迟容忍。" },
      { mode: "结构超载", cause: "进入角过陡、动压/过载超包线。", mitigation: "进入走廊、结构安全系数、载荷监测。" },
    ],
    referenceTitle: "参考再入系统",
    referenceLead:
      "比较不同任务的热环境与着陆方式，比记材料牌号更能建立直觉。",
    references: [
      { name: "Apollo", detail: "弹道/跳跃再入，烧蚀 AVCOAT，海上溅落。" },
      { name: "Space Shuttle", detail: "升力体，陶瓷 tiles + RCC，跑道着陆。" },
      { name: "MSL / Perseverance", detail: "火星进入，气壳 + 超声速伞 + 空中吊车。" },
      { name: "Starship", detail: "不锈钢箭体 + 六角 tiles，反推着陆/回收。" },
      { name: "Stardust / Genesis", detail: "高速返回，PICA 烧蚀与样本舱。" },
      { name: "LOFTID", detail: "充气减速器再入演示，面向大型载荷。" },
    ],
    resources: [
      { title: "Hypersonic and High-Temperature Gas Dynamics", author: "Anderson", type: "书", level: "进阶", note: "高超声速流动、真实气体与热化学。" },
      { title: "Hypersonic Aerothermodynamics", author: "Bertin", type: "书", level: "进阶", note: "气动加热与再入物理。" },
      { title: "NASA TPSX", author: "NASA Ames", type: "数据", level: "核心", note: "热防护材料物性数据库。", href: "https://tpsx.arc.nasa.gov/" },
      { title: "SU2", author: "SU2 社区", type: "文档", level: "进阶", note: "可压缩/高超声速 CFD。" , href: "https://su2code.github.io/" },
      { title: "OpenFOAM", author: "OpenFOAM 社区", type: "文档", level: "进阶", note: "热流、烧蚀与多物理场。" , href: "https://www.openfoam.com/" },
      { title: "Cantera", author: "Cantera 社区", type: "文档", level: "进阶", note: "高温气体化学与输运。" , href: "https://cantera.org/" },
      { title: "NASA CEA", author: "NASA Glenn", type: "数据", level: "核心", note: "高温气体组分与性能。" , href: "https://cearun.grc.nasa.gov/" },
      { title: "Basilisk", author: "AVS Lab", type: "文档", level: "进阶", note: "进入/制导/动力学仿真。" , href: "https://github.com/AVSLab/basilisk" },
      { title: "RocketPy", author: "RocketPy Team", type: "文档", level: "核心", note: "探空火箭再入/弹道。" , href: "https://github.com/RocketPy-Team/RocketPy" },
      { title: "NASA NTRS", author: "NASA", type: "数据", level: "参考", note: "再入、TPS 与飞行数据报告。" , href: "https://ntrs.nasa.gov/" },
    ],
    projects: [
      { name: "SU2", note: "高超声速 CFD。", lang: "C++", href: "https://su2code.github.io/" },
      { name: "OpenFOAM", note: "热流与多物理场。", lang: "C++", href: "https://www.openfoam.com/" },
      { name: "Cantera", note: "高温化学。", lang: "C++ / Python", href: "https://cantera.org/" },
      { name: "NASA CEA", note: "气体性能。", lang: "Fortran / Web", href: "https://cearun.grc.nasa.gov/" },
      { name: "Basilisk", note: "进入与 GNC 仿真。", lang: "C++ / Python", href: "https://github.com/AVSLab/basilisk" },
      { name: "RocketPy", note: "弹道与再入。", lang: "Python", href: "https://github.com/RocketPy-Team/RocketPy" },
      { name: "GMAT", note: "任务与轨道。", lang: "C++", href: "https://gmat.sourceforge.net/" },
    ],
    learn: [
      { label: "阶段 03 · 制导", href: "/roadmap/#gnc" },
      { label: "项目 12 · 垂直回收", href: "/projects/#landing" },
      { label: "C/C++ 工程 · 通信", href: "/flight-software/#comms" },
    ],
    boundaries:
      "本页不提供 TPS 配方、烧蚀材料工艺或再入飞行操作。高超声速 CFD、烧蚀与等离子体建模仍需实验数据校准；真实再入涉及极高风险与出口控制。",
    sources: [
      { label: "NASA TPSX", href: "https://tpsx.arc.nasa.gov/" },
      { label: "SU2", href: "https://su2code.github.io/" },
      { label: "OpenFOAM", href: "https://www.openfoam.com/" },
      { label: "Cantera", href: "https://cantera.org/" },
      { label: "NASA CEA", href: "https://cearun.grc.nasa.gov/" },
      { label: "NASA NTRS", href: "https://ntrs.nasa.gov/" },
      { label: "Basilisk", href: "https://github.com/AVSLab/basilisk" },
    ],
  },
  {
    slug: "structures",
    index: "05",
    title: "结构、材料与制造",
    en: "Structures, Materials & Manufacturing",
    accent: "gold",
    tagline: "火箭的重量，是在屈曲、焊缝与缺陷之间一分一分抠出来的。",
    summary:
      "结构把推力、气动、压力与热载荷安全地传到全箭；材料决定密度、强度、断裂与可制造性；制造决定缺陷、成本与节拍。运力竞争的很大一部分，发生在结构设计师的表格里。",
    stats: [
      { value: "3", label: "载荷类别", note: "飞行 / 压力 / 热" },
      { value: "1.25–1.5", label: "安全系数", note: "按标准与载荷定" },
      { value: "4", label: "材料族", note: "铝 / 钢 / 钛 / 复材" },
      { value: "2", label: "主导失效", note: "屈曲 / 疲劳" },
    ],
    equations: [
      {
        title: "薄壁压力容器",
        formula: "σ_hoop = p·r/t    σ_long = p·r/(2t)",
        body:
          "环向应力是纵向的两倍。这就是为什么贮箱沿环向加厚、焊缝与缺陷沿环向更危险。",
      },
      {
        title: "欧拉屈曲",
        formula: "P_cr = π²·E·I / (K·L)²",
        body:
          "细长杆/柱的临界载荷。真实壳体还要乘上折减系数（knockdown），因为几何缺陷会显著降低承载。",
      },
      {
        title: "壳体屈曲折减",
        formula: "P_cr,shell = γ·P_cr,ideal    γ < 1",
        body:
          "缺陷敏感性是壳体设计的核心。制造公差、焊接变形与试验分散性都要进入安全系数。",
      },
      {
        title: "热应力（约束）",
        formula: "σ_th = E·α·ΔT / (1 − ν)",
        body:
          "完全约束下的热应力。低温贮箱、再入结构与发动机热端都要处理热失配与热梯度。",
      },
      {
        title: "复合层合板",
        formula: "N = A·ε + B·κ    M = B·ε + D·κ",
        body:
          "层合板的耦合刚度会带来弯扭耦合。失效判据常用 Tsai-Wu、Hashin 或 Puck，但冲击损伤与分层往往先于强度失效。",
      },
      {
        title: "疲劳与损伤容限",
        formula: "N_f = f(Δσ, R, K_t, material)    a_c = f(K_IC, σ)",
        body:
          "复用结构必须回答“允许什么缺陷、检查间隔多长、剩余寿命多少”。一次静力通过不等于可复用。",
      },
    ],
    breakdownTitle: "结构元件与材料",
    breakdownLead:
      "从贮箱到推力结构，每个元件都在不同载荷路径上工作；材料选择要与制造、检测和复用策略一起考虑。",
    breakdown: [
      { name: "贮箱筒段", detail: "承受内压、轴压与弯曲；焊缝与环向应力控制设计。", metrics: ["p·r/t", "焊缝", "屈曲", "低温"] },
      { name: "箱底/穹顶", detail: "封头、过渡段与焊缝；成形与回弹难。", metrics: ["旋压", "焊缝", "应力集中", "检测"] },
      { name: "级间段/整流罩", detail: "承受气动、声振与分离载荷；复材常见。", metrics: ["声振", "分离", "热", "重量"] },
      { name: "推力结构", detail: "把发动机推力传到贮箱/箭体；集中载荷。", metrics: ["集中力", "疲劳", "热", "接口"] },
      { name: "着陆腿/栅格舵", detail: "复用火箭的展开、锁定与热载荷。", metrics: ["冲击", "作动", "热", "冗余"] },
      { name: "复合材料", detail: "碳纤维/环氧、CFRP 压力容器、夹层结构。", metrics: ["比强度", "冲击", "分层", "NDT"] },
      { name: "金属材料", detail: "Al-Li、2219、301/304L、钛合金、Inconel。", metrics: ["密度", "焊接", "低温", "成本"] },
      { name: "热结构", detail: "TPS、隔热、热障涂层与高温合金。", metrics: ["热流", "CTE", "氧化", "连接"] },
    ],
    tradeoffTitle: "结构方案权衡",
    tradeoffLead:
      "结构设计没有“最强材料”，只有在载荷、制造、检测、成本与复用次数之间的最优组合。",
    tradeoffs: [
      { option: "Al-Li vs 不锈钢", pros: "Al-Li 轻、成熟；不锈钢耐温、便宜、易焊。", cons: "Al-Li 低温/焊接敏感；不锈钢密度高。", use: "一次性一级 Al-Li；复用/低温 Starship 不锈钢。" },
      { option: "金属 vs 复材", pros: "金属各向同性、易检测；复材比强度高、可设计。", cons: "金属重；复材冲击/分层、连接与维修难。", use: "贮箱/热端金属；整流罩/舱段复材。" },
      { option: "硬壳 vs 半硬壳", pros: "硬壳简单；半硬壳/加筋效率高。", cons: "硬壳重；加筋制造与屈曲分析复杂。", use: "小箭体硬壳；大型箭体加筋/网格。" },
      { option: "焊接 vs 铆接/螺接", pros: "焊接轻、密封好；铆接/螺接可拆、成熟。", cons: "焊接热影响/缺陷；铆接增加重量与孔应力。", use: "贮箱焊接；舱段/设备螺接。" },
      { option: "增材 vs 机加/锻造", pros: "增材一体化、快速迭代；机加/锻造成熟、材料性能稳定。", cons: "增材缺陷/各向异性/成本；机加材料利用率低。", use: "复杂小件增材；主承力锻件/机加。" },
    ],
    failureTitle: "结构典型失效",
    failures: [
      { mode: "壳体屈曲", cause: "轴压/弯矩、几何缺陷、焊接变形、边界条件。", mitigation: "屈曲试验、knockdown、加筋、制造公差控制。" },
      { mode: "焊缝缺陷", cause: "气孔、未熔合、裂纹、残余应力。", mitigation: "焊接工艺评定、UT/RT/CT、焊后热处理、冗余设计。" },
      { mode: "复材分层", cause: "冲击、固化缺陷、连接孔、脱粘。", mitigation: "冲击损伤容限、NDT、紧固件设计、环境试验。" },
      { mode: "应力腐蚀", cause: "敏感材料 + 拉应力 + 腐蚀环境。", mitigation: "材料选择、涂层、应力水平控制、环境试验。" },
      { mode: "低温脆性", cause: "液氢/液氧温度下材料韧性下降。", mitigation: "低温材料、断裂韧性测试、冲击试验。" },
      { mode: "疲劳/复用", cause: "循环载荷、热循环、微裂纹扩展。", mitigation: "损伤容限、检查间隔、寿命因子、退役准则。" },
    ],
    referenceTitle: "参考结构案例",
    referenceLead:
      "材料选择与制造路线往往由任务次数、成本与供应链决定，而不是单看比强度。",
    references: [
      { name: "Starship", detail: "301/304L 不锈钢箭体 + 六角 TPS，强调低成本、可焊、复用。" },
      { name: "Falcon 9", detail: "Al-Li 2195 贮箱/箭体，可复用一级。" },
      { name: "SLS 核心级", detail: "2219 铝铜合金贮箱，液氢/液氧，一次性。" },
      { name: "Electron", detail: "碳纤维复合材料箭体，小型运载。" },
      { name: "New Glenn GS3", detail: "碳纤维液氢贮箱 + BE-7，高能上面级。" },
      { name: "Centaur", detail: "不锈钢薄壁 balloon tank，历史上面级。" },
    ],
    resources: [
      { title: "Spacecraft Structures", author: "Wijker", type: "书", level: "进阶", note: "航天结构载荷、屈曲、振动与试验。" },
      { title: "Spacecraft Structures and Mechanisms", author: "Sarafin", type: "书", level: "核心", note: "结构设计、机构与验证的工程参考。" },
      { title: "Materials and Processes for Spacecraft", author: "Dunn", type: "书", level: "参考", note: "航天材料、工艺与质量。" },
      { title: "NASA-STD-5001B", author: "NASA", type: "标准", level: "核心", note: "结构设计/试验安全系数。" , href: "https://standards.nasa.gov/standard/NASA/NASA-STD-5001" },
      { title: "NASA-STD-5020", author: "NASA", type: "标准", level: "参考", note: "紧固件系统要求。" , href: "https://standards.nasa.gov/standard/NASA/NASA-STD-5020" },
      { title: "CalculiX", author: "CalculiX 社区", type: "文档", level: "核心", note: "开源有限元，适合结构/热分析。" , href: "https://www.calculix.de/" },
      { title: "Code_Aster", author: "EDF", type: "文档", level: "进阶", note: "大型开源有限元与多物理场。" , href: "https://code-aster.org/" },
      { title: "OpenRadioss", author: "Altair / OpenRadioss", type: "文档", level: "进阶", note: "显式动力学、冲击与碰撞。" , href: "https://www.openradioss.org/" },
      { title: "PrePoMax", author: "PrePoMax", type: "文档", level: "入门", note: "CalculiX 前后处理。" , href: "https://prepomax.fs.um.si/" },
      { title: "OpenVSP", author: "NASA", type: "文档", level: "核心", note: "几何建模与气动初步分析。" , href: "https://openvsp.org/" },
      { title: "OpenMDAO", author: "OpenMDAO", type: "文档", level: "进阶", note: "多学科优化与伴随。" , href: "https://openmdao.org/" },
      { title: "FreeCAD", author: "FreeCAD", type: "文档", level: "入门", note: "开源 CAD 与工程建模。" , href: "https://www.freecad.org/" },
    ],
    projects: [
      { name: "CalculiX", note: "结构/热有限元。", lang: "C / Fortran", href: "https://www.calculix.de/" },
      { name: "Code_Aster", note: "多物理场有限元。", lang: "C++ / Python", href: "https://code-aster.org/" },
      { name: "OpenRadioss", note: "显式冲击动力学。", lang: "C / Fortran", href: "https://www.openradioss.org/" },
      { name: "PrePoMax", note: "CalculiX 前后处理。", lang: "C#", href: "https://prepomax.fs.um.si/" },
      { name: "OpenVSP", note: "几何与气动。", lang: "C++", href: "https://openvsp.org/" },
      { name: "OpenMDAO", note: "多学科优化。", lang: "Python", href: "https://openmdao.org/" },
      { name: "FreeCAD", note: "CAD 与装配。", lang: "C++ / Python", href: "https://www.freecad.org/" },
    ],
    learn: [
      { label: "阶段 05 · 系统验证", href: "/roadmap/#systems" },
      { label: "知识域 · 系统工程", href: "/fundamentals/#systems" },
      { label: "项目 11 · 探空火箭", href: "/projects/#sounding" },
    ],
    boundaries:
      "材料许用值、断裂韧性、焊接工艺与航天质保数据通常受企业/出口控制；本页不提供具体材料牌号的热处理/焊接参数或结构认证结论。任何飞行结构都必须经过载荷、试验与独立评审。",
    sources: [
      { label: "NASA-STD-5001B", href: "https://standards.nasa.gov/standard/NASA/NASA-STD-5001" },
      { label: "NASA-STD-5020", href: "https://standards.nasa.gov/standard/NASA/NASA-STD-5020" },
      { label: "CalculiX", href: "https://www.calculix.de/" },
      { label: "Code_Aster", href: "https://code-aster.org/" },
      { label: "OpenRadioss", href: "https://www.openradioss.org/" },
      { label: "OpenVSP", href: "https://openvsp.org/" },
      { label: "OpenMDAO", href: "https://openmdao.org/" },
    ],
  },
];
