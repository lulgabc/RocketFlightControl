export interface Topic {
  name: string;
  note: string;
}

export interface Phase {
  id: string;
  index: string;
  title: string;
  en: string;
  weeks: string;
  level: string;
  goal: string;
  summary: string;
  topics: Topic[];
  deliverable: {
    title: string;
    detail: string;
    pass: string[];
  };
  checkpoints: string[];
  resources: { label: string; href?: string }[];
  exit: string;
}

export const PHASES: Phase[] = [
  {
    id: "foundation",
    index: "00",
    title: "数学、物理与编程地基",
    en: "Foundations",
    weeks: "4–6 周",
    level: "入门 · 无前置",
    goal: "能独立把一个物理过程写成状态方程，并用代码稳定地积分出来。",
    summary:
      "微积分、线性代数、常微分方程、经典力学与数值方法。目标不是刷完教材，而是具备“把火箭写成方程”的最小能力。",
    topics: [
      { name: "微积分与常微分方程", note: "导数、积分、一阶/二阶 ODE、线性化、平衡点" },
      { name: "线性代数", note: "向量空间、矩阵变换、特征值、正交基、奇异值分解" },
      { name: "经典力学", note: "牛顿三定律、动量矩、刚体转动、能量与功率" },
      { name: "数值方法", note: "Euler、RK4、步长选择、稳定性、刚性系统、误差阶" },
      { name: "概率与统计", note: "随机变量、高斯分布、协方差、蒙特卡洛、置信区间" },
      { name: "Python 科学计算", note: "NumPy、SciPy、Matplotlib、Jupyter、版本管理" },
      { name: "单位与量纲", note: "SI 单位、量纲检查、角度制与弧度制、常见换算陷阱" },
    ],
    deliverable: {
      title: "一维火箭上升仿真器",
      detail:
        "只考虑竖直方向：变质量、推力随时间变化、重力随高度变化、二次阻力。分别用 Euler 与 RK4 积分，比较不同步长下的高度曲线和计算耗时。",
      pass: [
        "给出质量、速度、高度随时间的三联图",
        "说明 RK4 在相同步长下误差更小的原因",
        "用能量守恒检查无阻力工况的数值漂移",
        "记录一次因步长过大而发散的现象并解释",
      ],
    },
    checkpoints: [
      "能从牛顿第二定律推导变质量火箭的竖直运动方程",
      "能写出状态空间形式 ẋ = f(x, u)，并说明每个状态量的物理意义",
      "能解释 Euler、RK2、RK4 的局部截断误差阶数",
      "能对仿真结果做量纲检查和数量级 sanity check",
      "能计算理想 Δv 与重力损失，并说明二者的区别",
      "能用 Git 管理代码，并写一份可复现的实验 README",
    ],
    resources: [
      { label: "MIT 18.03 微分方程", href: "https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/" },
      { label: "MIT 18.06 线性代数", href: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" },
      { label: "Python 数值方法（Numerical Recipes 概览）", href: "https://numerical.recipes/" },
      { label: "SciPy 官方文档", href: "https://docs.scipy.org/doc/scipy/" },
    ],
    exit: "当你不再害怕看到 θ̈、J、q̇ 这些符号，并且能在一个晚上写出可运行的积分器，就可以进入下一阶段。",
  },
  {
    id: "dynamics",
    index: "01",
    title: "飞行动力学与六自由度建模",
    en: "Flight Dynamics",
    weeks: "6–8 周",
    level: "核心 · 需阶段 00",
    goal: "从力与力矩出发，搭出一个能解释“无控火箭为什么会翻”的六自由度仿真器。",
    summary:
      "坐标系、旋转、刚体六自由度方程、气动与推进模型。你将第一次看到静不稳定、动压峰值和质心漂移如何共同决定飞行成败。",
    topics: [
      { name: "坐标系与旋转", note: "惯性系/体系/气动系、DCM、欧拉角、四元数、万向节锁" },
      { name: "六自由度刚体方程", note: "平动与转动、科氏项、惯量张量、体轴角速度" },
      { name: "质量特性", note: "质心随燃料消耗漂移、转动惯量变化、推力偏心" },
      { name: "气动力与力矩", note: "升力、阻力、侧力、静稳定裕度、阻尼导数、跨声速" },
      { name: "推进模型", note: "推力曲线、比冲、喷管膨胀、推力矢量、燃烧室压力" },
      { name: "大气与风", note: "ISA 标准大气、密度高度、风切变、阵风模型" },
      { name: "飞行包线", note: "动压 q、马赫数、过载、最大 Q、颤振与气动加热概览" },
      { name: "数值实现", note: "四元数归一化、刚性问题、事件检测、配平与线性化" },
    ],
    deliverable: {
      title: "六自由度弹道仿真器",
      detail:
        "输入几何、质量、气动系数与推力曲线，输出三维轨迹、姿态、动压、马赫数与过载。用同一组输入与 OpenRocket / RocketPy 对比，解释偏差来源。",
      pass: [
        "无控静不稳定火箭在扰动下自然翻转",
        "轨迹与参考工具在合理假设下趋势一致",
        "能输出并解释最大动压点",
        "能人为改变静稳定裕度并观察响应变化",
      ],
    },
    checkpoints: [
      "能在惯性系、体系、气动系之间正确变换向量",
      "能写出完整六自由度方程并解释每一项",
      "能用四元数传播姿态且避免数值漂移",
      "能由几何与气动数据估算静稳定裕度",
      "能计算动压、马赫数与过载，并判断结构关注点",
      "能对非线性模型在某配平点做线性化",
    ],
    resources: [
      { label: "Zipfel《Modeling and Simulation of Aerospace Vehicle Dynamics》" },
      { label: "Stevens & Lewis《Aircraft Control and Simulation》" },
      { label: "Sutton《Rocket Propulsion Elements》" },
      { label: "RocketPy 文档", href: "https://docs.rocketpy.org/" },
      { label: "OpenRocket", href: "https://openrocket.info/" },
    ],
    exit: "如果你的仿真器能复现“火箭出架后先偏转、再翻转”，并且你能指出是哪个力矩造成的，这一阶段就通过了。",
  },
  {
    id: "control",
    index: "02",
    title: "控制理论：从 PID 到状态空间",
    en: "Control Theory",
    weeks: "8–10 周",
    level: "核心 · 需阶段 01",
    goal: "不靠试凑，能根据模型设计、分析并验证一个姿态控制器。",
    summary:
      "经典控制给你直觉，状态空间给你结构。重点不是公式量，而是能把超调、裕度、延迟、饱和与噪声放进同一张验收表。",
    topics: [
      { name: "传递函数与稳定性", note: "拉普拉斯变换、极点零点、劳斯判据、稳态误差" },
      { name: "频域分析", note: "Bode、Nyquist、增益裕度、相位裕度、带宽" },
      { name: "PID 与工程实现", note: "微分滤波、抗积分饱和、积分分离、设定点加权" },
      { name: "状态空间", note: "能控性、能观性、极点配置、观测器" },
      { name: "最优控制入门", note: "LQR、代价函数、权重选择、LQG" },
      { name: "离散与实现", note: "采样定理、ZOH、计算延迟、量化、执行机构速率限制" },
      { name: "非线性与饱和", note: "描述函数、极限环、增益调度、执行机构死区" },
      { name: "验证方法", note: "阶跃/斜坡/扰动响应、蒙特卡洛、鲁棒性边界" },
    ],
    deliverable: {
      title: "单轴姿态控制 + 推力矢量台架",
      detail:
        "先在一维刚体模型上设计 PID 与 LQR，加入陀螺噪声、舵机延迟和力矩饱和；再把控制器移植到桌面单摆或推力矢量台架，比较仿真与实测。",
      pass: [
        "给出超调、调节时间、稳态误差与相位裕度",
        "在 20% 模型参数偏差下仍保持稳定",
        "能演示积分饱和以及抗饱和后的改善",
        "台架实测与仿真的趋势一致，偏差有解释",
      ],
    },
    checkpoints: [
      "能由 Bode 图读出增益裕度与相位裕度并判断风险",
      "能解释 P、I、D 各自对哪类误差起作用",
      "能实现带滤波微分与抗积分饱和的 PID",
      "能设计状态反馈并配置观测器极点",
      "能说明采样周期与执行机构延迟对稳定性的影响",
      "能为控制器写自动化测试并给出通过/失败判据",
    ],
    resources: [
      { label: "MIT 16.06 自动控制原理", href: "https://ocw.mit.edu/courses/16-06-principles-of-automatic-control-fall-2012/" },
      { label: "MIT 16.31 反馈控制系统", href: "https://ocw.mit.edu/courses/16-30-feedback-control-systems-fall-2010/" },
      { label: "Åström & Murray《Feedback Systems》", href: "https://fbswiki.org/" },
      { label: "Beard & McLain《Small Unmanned Aircraft》", href: "https://uavbook.byu.edu/" },
      { label: "Python Control Systems Library", href: "https://python-control.readthedocs.io/" },
    ],
    exit: "当你能在答辩里说清“为什么是这个增益、裕度多少、最坏情况是什么”，而不是“调出来不抖”，就可以继续。",
  },
  {
    id: "gnc",
    index: "03",
    title: "导航、估计与制导",
    en: "Navigation & Guidance",
    weeks: "8–10 周",
    level: "核心 · 需阶段 02",
    goal: "只用带噪声的 IMU、气压计和 GNSS，估计出可用姿态与位置，并生成可行制导指令。",
    summary:
      "飞控真正困难的部分：你不知道自己在哪、朝哪、多快，却必须决定下一步往哪推。状态估计与制导律在这里会合。",
    topics: [
      { name: "传感器与误差", note: "陀螺零偏、加速度计噪声、磁力计畸变、气压滞后、GNSS 多径" },
      { name: "姿态估计", note: "互补滤波、Mahony、Madgwick、四元数 EKF" },
      { name: "卡尔曼滤波", note: "预测/更新、协方差、过程噪声、新息检验、EKF/UKF" },
      { name: "惯性导航", note: "机械编排、比力、重力模型、漂移传播、INS/GNSS 组合" },
      { name: "高度与速度融合", note: "气压+加速度计+GNSS、互补滤波、发射段鲁棒性" },
      { name: "制导律", note: "重力转弯、比例导引 PN/APN、追踪律、终端约束" },
      { name: "轨迹优化入门", note: "最优控制、打靶法、直接配点、凸优化直觉" },
      { name: "验证", note: "蒙特卡洛、可观测性、故障传感器注入、日志复盘" },
    ],
    deliverable: {
      title: "EKF 状态估计 + 二维制导闭环",
      detail:
        "用公开的飞行日志或自采 IMU/气压数据做姿态与高度估计；在二维平面内实现重力转弯与比例导引，加入风与测量噪声，做 500 次蒙特卡洛。",
      pass: [
        "估计器在陀螺零偏与磁干扰下仍收敛",
        "能展示协方差与真实误差的一致性",
        "制导闭环能命中给定终端约束",
        "蒙特卡洛给出落点散布与失败原因分类",
      ],
    },
    checkpoints: [
      "能推导卡尔曼增益并解释协方差如何传播",
      "能建立 IMU 随机误差模型并标定零偏",
      "能实现四元数姿态 EKF 并处理磁力计异常",
      "能解释 INS 漂移的来源与组合导航的作用",
      "能实现重力转弯或比例导引并说明适用条件",
      "能分析系统可观测性并指出不可观状态",
    ],
    resources: [
      { label: "Simon《Optimal State Estimation》" },
      { label: "Groves《Principles of GNSS, Inertial and Multisensor Integrated Navigation》" },
      { label: "Vallado《Fundamentals of Astrodynamics and Applications》" },
      { label: "PX4 状态估计文档", href: "https://docs.px4.io/main/en/advanced_config/tuning_the_ecl_ekf.html" },
      { label: "Stanford AA 203 最优控制", href: "https://web.stanford.edu/class/aa203/" },
    ],
    exit: "当你能解释“为什么估计器在起飞瞬间会短暂发散、又为什么能恢复”，而不是把日志截图发到群里问，就通过了。",
  },
  {
    id: "embedded",
    index: "04",
    title: "嵌入式飞控与实时软件",
    en: "Embedded Flight Software",
    weeks: "8–12 周",
    level: "工程 · 需阶段 02–03",
    goal: "把仿真里的控制器放到一块真实 MCU 上，在固定周期内稳定运行，并能定位任何一次抖动。",
    summary:
      "从数据手册、总线和中断开始，写出一个最小但完整的飞控：采集、估计、控制、输出、记录、失效保护。",
    topics: [
      { name: "MCU 与工具链", note: "STM32/ESP32、时钟树、中断、DMA、调试器、链接脚本" },
      { name: "实时调度", note: "裸机时间片、FreeRTOS 任务/优先级、抖动测量、优先级反转" },
      { name: "传感器总线", note: "I2C、SPI、UART、CAN、时序、错误恢复" },
      { name: "执行机构", note: "PWM、DShot、舵机、电调、推力矢量机构、限位与速率" },
      { name: "传感器校准", note: "陀螺零偏、加速度计六面、磁力计椭球拟合、温度漂移" },
      { name: "控制回路", note: "固定步长、时间戳、延迟补偿、滤波器、1 kHz 回路" },
      { name: "可靠性与安全", note: "看门狗、掉电检测、失效保护、飞行终止、黑匣子日志" },
      { name: "通信与地面站", note: "MAVLink、遥测链路、参数系统、固件升级" },
    ],
    deliverable: {
      title: "最小可飞飞控",
      detail:
        "一块 MCU + IMU + 气压计 + 舵机/电机输出。实现 1 kHz 姿态回路、串口遥测、SD 卡日志、失控保护和地面测试模式。所有关键模块有单元测试或台架测试。",
      pass: [
        "姿态回路在 1 kHz 下抖动小于周期的 5%",
        "传感器校准可重复，重启后参数保留",
        "拔掉遥控/地面站能进入预设失效保护",
        "日志能还原一次完整台架测试",
      ],
    },
    checkpoints: [
      "能看懂原理图并正确配置 SPI/I2C 外设",
      "能用逻辑分析仪定位一次总线通信失败",
      "能测量控制回路的周期抖动并解释来源",
      "能完成 IMU 与磁力计的校准并验证残差",
      "能设计看门狗、失控保护与飞行终止逻辑",
      "能用版本化配置和日志复现一次测试",
    ],
    resources: [
      { label: "PX4 开发者文档", href: "https://docs.px4.io/main/en/development/development.html" },
      { label: "ArduPilot 开发者文档", href: "https://ardupilot.org/dev/" },
      { label: "Betaflight 源码", href: "https://github.com/betaflight/betaflight" },
      { label: "FreeRTOS 文档", href: "https://www.freertos.org/Documentation/RTOS_book.html" },
      { label: "MAVLink 协议", href: "https://mavlink.io/" },
    ],
    exit: "当你的飞控能在桌面上连续运行两小时、日志完整、任意拔线都能安全收敛，再考虑装到真火箭上。",
  },
  {
    id: "systems",
    index: "05",
    title: "系统集成、验证与飞行安全",
    en: "Integration & Verification",
    weeks: "8–12 周",
    level: "工程 · 需阶段 04",
    goal: "把“能飞的代码”变成“可重复、可解释、可中止的飞行系统”。",
    summary:
      "真实飞行不是控制器的独角戏。需求、接口、HIL、故障注入、发射许可与复盘，决定了系统能不能被信任。",
    topics: [
      { name: "系统工程", note: "需求、接口、架构、权衡、配置管理、评审" },
      { name: "SIL 与 HIL", note: "软件在环、硬件在环、实时仿真、故障注入" },
      { name: "验证与确认", note: "V&V、测试覆盖、验收判据、统计置信度" },
      { name: "可靠性与容错", note: "FMEA、冗余、表决、降级模式、单点失效" },
      { name: "飞行安全", note: "飞行终止系统、禁飞区、人员距离、发射许可、空域协调" },
      { name: "发射操作", note: "检查单、气象约束、倒计时、异常中止、回收" },
      { name: "数据复盘", note: "遥测/黑匣子对齐、偏差归因、模型更新" },
      { name: "标准与流程", note: "NASA SE、ECSS、DO-178C 思路、可重复构建" },
    ],
    deliverable: {
      title: "探空火箭飞控完整闭环",
      detail:
        "从需求文档开始，完成 SIL→HIL→地面测试→飞行→复盘。至少 1000 次蒙特卡洛、一次故障注入演练和一份飞行前评审材料。",
      pass: [
        "需求条目可追溯到测试用例",
        "HIL 能复现至少三类故障并触发保护",
        "蒙特卡洛给出成功率和主要失效模式",
        "飞行数据与仿真偏差有量化解释",
      ],
    },
    checkpoints: [
      "能把任务目标写成可验证的需求与验收标准",
      "能搭 SIL/HIL 台架并注入传感器与执行机构故障",
      "能做 FMEA 并识别单点失效",
      "能设计飞行终止逻辑并验证其独立性",
      "能完成一次发射前评审并给出 go/no-go 判据",
      "能用飞行数据更新模型并量化残差",
    ],
    resources: [
      { label: "NASA Systems Engineering Handbook", href: "https://www.nasa.gov/reference/systems-engineering-handbook/" },
      { label: "ECSS 标准体系", href: "https://ecss.nl/" },
      { label: "FAA Commercial Space Transportation", href: "https://www.faa.gov/space" },
      { label: "NAR 安全规范", href: "https://www.nar.org/" },
      { label: "Tripoli Rocketry Association", href: "https://www.tripoli.org/" },
    ],
    exit: "当你能在失败后指出“是需求漏了、模型错了，还是操作错了”，而不是只换一个传感器，这一阶段就完成了。",
  },
  {
    id: "advanced",
    index: "06",
    title: "进阶：最优制导、回收与多飞行器",
    en: "Advanced GNC",
    weeks: "持续",
    level: "进阶 · 需阶段 03–05",
    goal: "进入以优化、鲁棒性和自主性为核心的现代 GNC，并具备复现论文的能力。",
    summary:
      "从“能稳定”走向“最优、最省、最安全”。这也是可重复使用火箭、行星着陆、卫星姿态控制与编队的共同基础。",
    topics: [
      { name: "凸优化制导", note: "动力下降、损失凸化、SOCP、燃料最优、禁飞区约束" },
      { name: "模型预测控制", note: "滚动时域、约束、实时性、非线性 MPC" },
      { name: "鲁棒与自适应", note: "H∞、μ 综合、L1 自适应、增益调度" },
      { name: "学习辅助控制", note: "系统辨识、神经网络补偿、强化学习边界" },
      { name: "多飞行器", note: "编队、一致性、碰撞规避、星座维持" },
      { name: "姿态与轨道控制", note: "ADCS、动量轮、磁力矩器、轨道保持" },
      { name: "实时实现", note: "嵌入式优化求解器、代码生成、最坏执行时间" },
      { name: "论文复现", note: "读公式、复现实验、比较基线、写技术报告" },
    ],
    deliverable: {
      title: "二维垂直回收制导",
      detail:
        "在同一动力学模型上比较 PD 制导、Apollo 多项式制导与凸优化/SOCP 制导：燃料消耗、终端精度、约束满足率与计算时间。",
      pass: [
        "能写出含推力上下限与姿态约束的着陆优化问题",
        "能解释损失凸化与松弛的代价",
        "实现至少两种制导并做定量比较",
        "给出嵌入式实时性的初步评估",
      ],
    },
    checkpoints: [
      "能把动力下降问题写成带约束的优化问题",
      "能解释凸优化制导相对 PD 的优势与假设",
      "能实现一个 MPC 并处理约束违反",
      "能评估模型不确定性下的鲁棒性",
      "能复现一篇 GNC 论文的核心实验",
      "能写出一份可被同行审阅的技术报告",
    ],
    resources: [
      { label: "Boyd《Convex Optimization》", href: "https://web.stanford.edu/~boyd/cvxbook/" },
      { label: "Bryson & Ho《Applied Optimal Control》" },
      { label: "Stanford AA 203", href: "https://web.stanford.edu/class/aa203/" },
      { label: "Açıkmeşe & Ploen, Convex Programming Approach to Powered Descent Guidance", href: "https://doi.org/10.2514/1.27553" },
      { label: "NASA GMAT", href: "https://gmat.sourceforge.net/" },
    ],
    exit: "没有终点。选一个方向深入，并把复现结果公开——这是从学习者变成贡献者的分界线。",
  },
];

export const TOTAL_CHECKPOINTS = PHASES.reduce((sum, phase) => sum + phase.checkpoints.length, 0);
