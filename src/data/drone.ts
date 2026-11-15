export type DroneMaturity = "production" | "early" | "research" | "watch";

export interface DronePrinciple {
  title: string;
  formula?: string;
  body: string;
}

export interface DroneStackItem {
  layer: string;
  tools: string[];
  note: string;
}

export interface DroneBuildStep {
  step: string;
  title: string;
  detail: string;
  gate: string;
}

export interface DroneFailure {
  mode: string;
  cause: string;
  mitigation: string;
}

export interface DroneProject {
  name: string;
  note: string;
  lang: string;
  href: string;
}

export interface DroneResource {
  title: string;
  author: string;
  type: "文档" | "书" | "课程" | "标准" | "数据";
  level: "入门" | "核心" | "进阶" | "参考";
  note: string;
  href?: string;
}

export interface DroneTrend {
  title: string;
  maturity: DroneMaturity;
  detail: string;
}

export interface DroneTrack {
  slug: string;
  index: string;
  title: string;
  en: string;
  accent: "orange" | "teal" | "gold" | "blue" | "red";
  tagline: string;
  summary: string;
  stats: { value: string; label: string; note?: string }[];
  principles: DronePrinciple[];
  stack: DroneStackItem[];
  build: DroneBuildStep[];
  failures: DroneFailure[];
  projects: DroneProject[];
  resources: DroneResource[];
  trends: DroneTrend[];
  learn: { label: string; href: string }[];
  boundaries: string;
  sources: { label: string; href: string }[];
}

export const DRONE_TRACKS: DroneTrack[] = [
  {
    slug: "autonomy",
    index: "01",
    title: "自主飞行",
    en: "Autonomy Stack",
    accent: "teal",
    tagline: "从摇杆到“自己飞”，中间隔着估计、规划与时间同步。",
    summary:
      "PX4 / ArduPilot 负责底层姿态与位置控制，ROS 2、MAVSDK、uXRCE-DDS / Zenoh 把任务、视觉与规划接上。自主飞行的核心不是“写个 Offboard”，而是让坐标系、时间戳、失效保护与延迟全部闭合。",
    stats: [
      { value: "3", label: "架构层", note: "飞控 / 中间件 / 任务" },
      { value: "2", label: "飞控生态", note: "PX4 / ArduPilot" },
      { value: "1", label: "时间基", note: "时间戳必须统一" },
      { value: "6", label: "传感器类", note: "IMU / 气压 / 磁 / GNSS / 视觉 / 测距" },
    ],
    principles: [
      { title: "坐标系与时间戳", body: "机体系、NED/ENU、相机系、世界系必须明确；每个传感器数据都要带时间戳，否则 EKF 与视觉融合会用“过去的数据控制现在”。" },
      { title: "状态估计", formula: "x̂ₖ = f(x̂ₖ₋₁, u) + K(z − h(x̂))", body: "PX4 的 EKF / ArduPilot 的 EKF3 融合 IMU、气压、磁力计、GNSS 与视觉。估计器发散通常不是公式错，而是噪声、延迟、坐标系或磁干扰。" },
      { title: "串级控制", body: "位置 → 速度 → 姿态 → 角速率 → 电机。外环带宽低、内环带宽高；任何一层饱和或延迟都会让上层“看起来”不稳定。" },
      { title: "Offboard 与模式机", body: "Offboard 不是“绕过飞控”，而是通过 MAVLink/MAVSDK 发送设定点。必须定义超时、失联、低电量与位置跳变时的退出策略。" },
      { title: "视觉惯性里程计", body: "VIO 提供高频相对位姿，但尺度、漂移与光照敏感。与飞控 EKF 融合前，先验证时间同步、外参和坐标系。" },
      { title: "延迟与调度", body: "相机 30 Hz、VIO 30–60 Hz、飞控 200–1 kHz、避障 10–20 Hz。端到端延迟超过控制带宽，就会振荡或撞上“看见时已经来不及”的障碍。" },
    ],
    stack: [
      { layer: "飞控", tools: ["PX4", "ArduPilot", "EKF2 / EKF3", "Offboard"], note: "姿态/位置控制、失效保护、日志与模式管理。" },
      { layer: "中间件", tools: ["uXRCE-DDS", "Zenoh", "MAVLink 2", "MAVSDK"], note: "把 uORB / MAVLink 数据接到 ROS 2 与任务计算机。" },
      { layer: "任务与规划", tools: ["ROS 2", "BehaviorTree.CPP", "Nav2", "OMPL"], note: "行为树、路径规划、任务状态机与重规划。" },
      { layer: "感知", tools: ["VINS-Fusion", "OpenVINS", "FAST-LIO2", "RTAB-Map"], note: "VIO、LiDAR 惯性里程计、建图与重定位。" },
      { layer: "仿真", tools: ["Gazebo", "Isaac Sim", "Flightmare", "gym-pybullet-drones"], note: "SITL、传感器仿真、域随机化与回归测试。" },
      { layer: "地面站", tools: ["QGroundControl", "Mission Planner", "MAVSDK", "Open MCT"], note: "任务、参数、日志、遥测与回放。" },
    ],
    build: [
      { step: "01", title: "SITL 起飞", detail: "PX4 + Gazebo 做定点、Offboard 起飞/降落，录 rosbag 与飞控日志。", gate: "Offboard 超时能自动退出，位置无跳变。" },
      { step: "02", title: "坐标与时间对齐", detail: "把 ENU/NED、相机系、机体系统一；测量相机到 IMU 的外参与时间偏移。", gate: "静态与动态对齐误差可量化。" },
      { step: "03", title: "VIO 接入", detail: "VINS-Fusion/OpenVINS 输出位姿，与飞控 EKF 融合或做外部视觉。", gate: "悬停漂移、尺度与延迟在指标内。" },
      { step: "04", title: "避障闭环", detail: "深度相机/激光雷达 + 局部规划，限制速度与倾斜角。", gate: "静态/动态障碍均能停或绕。" },
      { step: "05", title: "真机与失效", detail: "低高度、系留/护网、手动接管；注入视觉丢失、GPS 丢失、链路丢失。", gate: "每类失效都能进入安全模式。" },
    ],
    failures: [
      { mode: "EKF 发散", cause: "磁干扰、振动、GPS 多径、传感器时间不同步。", mitigation: "罗盘校准、减振、日志分析、创新检验、备份估计源。" },
      { mode: "Offboard 超时", cause: "伴飞计算机卡顿、网络中断、设定点流停止。", mitigation: "飞控超时参数、失效保护、看门狗、手动接管。" },
      { mode: "VIO 漂移/尺度错误", cause: "纹理不足、光照突变、快速旋转、外参错误。", mitigation: "多传感器融合、曝光控制、外参标定、失败检测。" },
      { mode: "坐标系数值错误", cause: "ENU/NED 混用、相机系与机体系未对齐。", mitigation: "单元测试、可视化、已知点验证、坐标变换库。" },
      { mode: "避障延迟", cause: "感知 pipeline 过长、规划频率低、执行器饱和。", mitigation: "端到端延迟预算、降速、前视距离、急停策略。" },
      { mode: "通信丢包", cause: "Wi-Fi/4G 抖动、天线遮挡、链路拥塞。", mitigation: "MAVLink 心跳、冗余链路、断链 RTL、QoS。" },
    ],
    projects: [
      { name: "PX4 Autopilot", note: "飞控、EKF、SITL、Offboard。", lang: "C++", href: "https://github.com/PX4/PX4-Autopilot" },
      { name: "ArduPilot", note: "多旋翼/固定翼/rover，EKF3 与日志。", lang: "C++", href: "https://github.com/ArduPilot/ardupilot" },
      { name: "MAVSDK", note: "多语言 MAVLink 任务 API。", lang: "C++ / Python", href: "https://github.com/mavlink/MAVSDK" },
      { name: "ROS 2", note: "任务、感知与规划中间件。", lang: "C++ / Python", href: "https://docs.ros.org/" },
      { name: "uXRCE-DDS", note: "PX4 uORB ↔ ROS 2 桥。", lang: "C / C++", href: "https://github.com/eProsima/Micro-XRCE-DDS" },
      { name: "VINS-Fusion", note: "视觉惯性里程计。", lang: "C++", href: "https://github.com/HKUST-Aerial-Robotics/VINS-Fusion" },
      { name: "OpenVINS", note: "滤波式 VIO。", lang: "C++", href: "https://github.com/rpng/open_vins" },
      { name: "FAST-LIO2", note: "LiDAR 惯性里程计。", lang: "C++", href: "https://github.com/hku-mars/FAST_LIO" },
      { name: "Gazebo", note: "PX4/ArduPilot SITL 仿真。", lang: "C++", href: "https://gazebosim.org/" },
      { name: "Isaac Sim", note: "高保真传感器与域随机化。", lang: "Python", href: "https://developer.nvidia.com/isaac/sim" },
    ],
    resources: [
      { title: "PX4 官方文档", author: "PX4", type: "文档", level: "核心", note: "模式、EKF、Offboard、SITL、参数与日志。", href: "https://docs.px4.io/" },
      { title: "ArduPilot 官方文档", author: "ArduPilot", type: "文档", level: "核心", note: "多旋翼/固定翼、EKF3、失效保护与调参。", href: "https://ardupilot.org/" },
      { title: "MAVLink 开发者指南", author: "MAVLink", type: "文档", level: "核心", note: "消息、心跳、命令、签名与协议版本。", href: "https://mavlink.io/" },
      { title: "ROS 2 文档", author: "ROS 2", type: "文档", level: "核心", note: "节点、QoS、TF2、rosbag 与实时性。", href: "https://docs.ros.org/" },
      { title: "QGroundControl", author: "MAVLink", type: "文档", level: "核心", note: "任务规划、参数、日志与固件。", href: "https://github.com/mavlink/qgroundcontrol" },
      { title: "Small Unmanned Aircraft", author: "Beard & McLain", type: "书", level: "核心", note: "小型无人机 GNC、估计与路径跟踪。", href: "https://uavbook.byu.edu/" },
      { title: "Probabilistic Robotics", author: "Thrun, Burgard & Fox", type: "书", level: "进阶", note: "概率估计、定位、SLAM 与规划。" },
      { title: "Robotics: Modelling, Planning and Control", author: "Siciliano et al.", type: "书", level: "进阶", note: "机器人运动学、动力学与控制。" },
    ],
    trends: [
      { title: "PX4 + ROS 2 + Zenoh", maturity: "early", detail: "uXRCE-DDS 仍是主流；Zenoh 在跨网段、云边协同与多机场景中快速成熟。" },
      { title: "Sim-to-Real 与域随机化", maturity: "early", detail: "Isaac Sim/Isaac Lab、Gazebo 与 Flightmare 用于大规模回归；真实世界的风、光照与振动仍是难点。" },
      { title: "视觉/激光融合导航", maturity: "production", detail: "VIO + LiDAR + GNSS 的组合在室内、GPS 拒止与 BVLOS 场景成为标配方向。" },
    ],
    learn: [
      { label: "阶段 03 · 导航与制导", href: "/roadmap/#gnc" },
      { label: "C/C++ 工程 · GNC", href: "/flight-software/#gnc" },
      { label: "工程核心 · 飞船 GNC", href: "/engineering/spacecraft/" },
    ],
    boundaries:
      "本页不提供绕过空域/适航/Remote ID 的方法，也不提供对他人无人机进行干扰、劫持或攻击的操作。真实飞行必须在合法空域、合规设备与当地法规下进行。",
    sources: [
      { label: "PX4", href: "https://docs.px4.io/" },
      { label: "ArduPilot", href: "https://ardupilot.org/" },
      { label: "MAVLink", href: "https://mavlink.io/" },
      { label: "ROS 2", href: "https://docs.ros.org/" },
      { label: "uXRCE-DDS", href: "https://github.com/eProsima/Micro-XRCE-DDS" },
      { label: "VINS-Fusion", href: "https://github.com/HKUST-Aerial-Robotics/VINS-Fusion" },
      { label: "Gazebo", href: "https://gazebosim.org/" },
    ],
  },
  {
    slug: "fpv",
    index: "02",
    title: "FPV 与高性能飞行",
    en: "FPV & High-Performance",
    accent: "orange",
    tagline: "在 5 寸机架上，把控制带宽、链路延迟与手感推到极限。",
    summary:
      "Betaflight、ExpressLRS、EdgeTX、Bluejay 与 HD 数字图传构成现代 FPV 的开源/半开源栈。它看起来是“飞手文化”，本质却是实时控制、射频链路、滤波与电源完整性的硬工程。",
    stats: [
      { value: "5\"", label: "主流尺寸", note: "freestyle / racing" },
      { value: "2.4/900", label: "链路频段", note: "MHz，视地区法规" },
      { value: "3", label: "图传生态", note: "DJI / Walksnail / HDZero" },
      { value: "1", label: "核心指标", note: "端到端延迟" },
    ],
    principles: [
      { title: "角速率环", body: "FPV 的手感主要来自角速率环，而不是角度环。摇杆给的是角速度目标，PID 把陀螺测得的角速度追上去。" },
      { title: "PID 与滤波", formula: "u = Kp·e + Ki∫e + Kd·de/dt", body: "D 项放大噪声，所以要先滤波再微分。陀螺滤波、动态 notch、RPM filter 与 D 项滤波是同一件事的不同层面。" },
      { title: "电机/电调协议", body: "PWM、OneShot、DShot、双向 DShot 决定指令分辨率、遥测与 RPM 反馈。DShot 不是“更快的 PWM”，而是数字帧协议。" },
      { title: "射频链路预算", body: "发射功率、天线增益、极化、遮挡、地面噪声与接收灵敏度共同决定距离。2.4 GHz 绕射好、900 MHz 穿透强，但都受法规功率限制。" },
      { title: "视频延迟", body: "模拟图传延迟低但画质差；HD 数字图传画质好但有编码/解码延迟。竞速与 freestyle 对延迟的容忍度不同。" },
      { title: "电源完整性", body: "电池内阻、ESC 电容、线径、接头与瞬态电流决定“掉电重启/失控”的风险。高 KV 电机 + 低 C 电池是最常见的炸机组合。" },
    ],
    stack: [
      { layer: "飞控固件", tools: ["Betaflight", "INAV", "ArduPilot"], note: "Betaflight 偏手动/竞速；INAV 偏 GPS/长航时；ArduPilot 偏自主。" },
      { layer: "遥控链路", tools: ["ExpressLRS", "Crossfire", "EdgeTX"], note: "ELRS 开源、低延迟、多频段；EdgeTX 是开源遥控器固件。" },
      { layer: "电调", tools: ["BLHeli_S", "Bluejay", "FETtec"], note: "Bluejay 提供 PWM 频率、双向 DShot 与 RPM 遥测。" },
      { layer: "图传", tools: ["DJI O3/O4", "Walksnail", "HDZero", "模拟"], note: "数字图传画质/延迟/价格权衡；模拟仍是低延迟备份。" },
      { layer: "调参与日志", tools: ["Betaflight Configurator", "PIDToolbox", "Blackbox Explorer"], note: "用黑盒日志看噪声、滤波、D 项与电机饱和。" },
      { layer: "整机", tools: ["5\" / 7\" / cinewhoop", "LiPo / Li-ion"], note: "尺寸、桨、KV、电池与用途强耦合。" },
    ],
    build: [
      { step: "01", title: "机架与动力", detail: "选 5 寸机架、电机 KV、ESC、桨与 6S 电池；核对电流与散热。", gate: "悬停电流、温度与电压降在安全范围。" },
      { step: "02", title: "飞控与固件", detail: "Betaflight 目标、端口、陀螺方向、DShot、双向遥测、ELRS 绑定。", gate: "电机转向正确、 failsafe 可触发。" },
      { step: "03", title: "滤波与 PID", detail: "先看黑盒噪声，再调滤波/RPM filter，最后调 PID 与 rates。", gate: "无持续振荡、电机不过热、D 项不爆。" },
      { step: "04", title: "图传与天线", detail: "VTX 功率、频道、天线极化、OSD、低电量告警。", gate: "地面拉距与遮挡测试通过。" },
      { step: "05", title: "失效与回收", detail: "GPS rescue/失控保护、蜂鸣器、寻机、桨保护、飞行前检查。", gate: "关控/断图传能进入预设保护。" },
    ],
    failures: [
      { mode: "电机/电调失步", cause: "高 KV + 大桨 + 低 C 电池、DShot 时序、ESC 固件不匹配。", mitigation: "降负载、加电容、正确 BLHeli/Bluejay 设置、地面温升测试。" },
      { mode: "失控/飞走", cause: "接收机丢包、飞控 failsafe 配置错误、GPS rescue 参数不当。", mitigation: "ELRS 动态功率、 failsafe 测试、GPS rescue 半径/高度、蜂鸣器。" },
      { mode: "图传丢失", cause: "天线遮挡、VTX 过热、频道冲突、电源噪声。", mitigation: "天线布局、VTX 散热、频道扫描、LC 滤波。" },
      { mode: "桨叶共振/抖动", cause: "桨不平衡、机架柔性、滤波不足、电机轴承。", mitigation: "动平衡、加强机架、动态 notch、更换轴承。" },
      { mode: "电池鼓包/起火", cause: "过放、过流、撞击、充电不当。", mitigation: "电压告警、C 率匹配、阻燃袋、存储电压。" },
    ],
    projects: [
      { name: "Betaflight", note: "开源飞控固件。", lang: "C", href: "https://github.com/betaflight/betaflight" },
      { name: "INAV", note: "GPS/长航时/固定翼。", lang: "C", href: "https://github.com/iNavFlight/inav" },
      { name: "ExpressLRS", note: "开源低延迟 RC 链路。", lang: "C / C++", href: "https://github.com/ExpressLRS/ExpressLRS" },
      { name: "EdgeTX", note: "开源遥控器固件。", lang: "C / C++", href: "https://github.com/EdgeTX/edgetx" },
      { name: "Bluejay", note: "BLHeli_S 开源电调固件。", lang: "C", href: "https://github.com/mathiasvr/bluejay" },
      { name: "Betaflight Blackbox Explorer", note: "黑盒日志分析。", lang: "JavaScript", href: "https://github.com/betaflight/blackbox-log-viewer" },
      { name: "ExpressLRS Configurator", note: "ELRS 固件/绑定/配置。", lang: "C++ / Python", href: "https://github.com/ExpressLRS/ExpressLRS-Configurator" },
    ],
    resources: [
      { title: "Betaflight Wiki", author: "Betaflight", type: "文档", level: "核心", note: "模式、PID、滤波、 failsafe 与黑盒。", href: "https://betaflight.com/docs/wiki" },
      { title: "ExpressLRS 文档", author: "ExpressLRS", type: "文档", level: "核心", note: "频段、功率、绑定、动态功率与法规。", href: "https://www.expresslrs.org/" },
      { title: "EdgeTX 文档", author: "EdgeTX", type: "文档", level: "核心", note: "遥控器模型、混控、遥测与 Lua。", href: "https://edgetx.org/" },
      { title: "INAV 文档", author: "INAV", type: "文档", level: "核心", note: "GPS 导航、固定翼与长航时。", href: "https://github.com/iNavFlight/inav/wiki" },
      { title: "Bluejay 文档", author: "Bluejay", type: "文档", level: "进阶", note: "PWM 频率、双向 DShot、RPM 遥测。", href: "https://github.com/mathiasvr/bluejay" },
      { title: "Blackbox 日志分析", author: "Betaflight", type: "文档", level: "进阶", note: "用日志看噪声、滤波与 PID。", href: "https://betaflight.com/docs/wiki" },
    ],
    trends: [
      { title: "HD 数字图传低延迟化", maturity: "production", detail: "DJI O4、Walksnail、HDZero 在画质/延迟/价格上分层；竞速仍看重最低延迟。" },
      { title: "ELRS 生态扩张", maturity: "production", detail: "2.4 GHz 与 900 MHz 双频、动态功率、MAVLink 透传与 Racing 模式。" },
      { title: "数据驱动调参", maturity: "early", detail: "黑盒频域分析、自动滤波/ PID 建议工具，但仍需人工判断与飞行验证。" },
    ],
    learn: [
      { label: "阶段 02 · 控制理论", href: "/roadmap/#control" },
      { label: "项目 04 · 单轴 PID", href: "/projects/#pid" },
      { label: "C/C++ 工程 · 实时系统", href: "/flight-software/#realtime" },
    ],
    boundaries:
      "射频发射功率、频段与飞行空域受当地法规约束；本页不提供破解图传/接收机、干扰他人链路或超功率发射的指导。FPV 飞行必须遵守空域、隐私与安全规定。",
    sources: [
      { label: "Betaflight", href: "https://betaflight.com/" },
      { label: "ExpressLRS", href: "https://www.expresslrs.org/" },
      { label: "EdgeTX", href: "https://edgetx.org/" },
      { label: "INAV", href: "https://github.com/iNavFlight/inav" },
      { label: "Bluejay", href: "https://github.com/mathiasvr/bluejay" },
      { label: "Betaflight GitHub", href: "https://github.com/betaflight/betaflight" },
    ],
  },
  {
    slug: "edge-ai",
    index: "03",
    title: "机载边缘 AI",
    en: "Onboard Edge AI",
    accent: "gold",
    tagline: "把感知、推理与控制塞进 10–30 W 的功耗预算。",
    summary:
      "Jetson Orin Nano Super、RK3588、Hailo-8L 等边缘算力让无人机能在机上跑 VIO、检测、跟踪与局部规划。难点不是“跑通 YOLO”，而是功耗、散热、延迟、模型漂移与失效保护 simultaneously 闭合。",
    stats: [
      { value: "10–30", label: "W 级功耗", note: "companion computer" },
      { value: "30–60", label: "FPS 级", note: "检测/跟踪" },
      { value: "1", label: "硬约束", note: "热与电源" },
      { value: "3", label: "级流水线", note: "感知 / 估计 / 控制" },
    ],
    principles: [
      { title: "功耗与散热", body: "Jetson 的峰值算力与持续算力是两回事。机舱高温、无风扇/小风扇、电池电压跌落都会让 GPU 降频，进而让感知延迟抖动。" },
      { title: "传感器到控制的延迟", formula: "t_total = t_capture + t_infer + t_fuse + t_cmd", body: "每一段都要测。30 FPS 相机本身就有 33 ms 间隔；推理 20 ms、融合 10 ms、链路 10 ms，端到端就可能超过 70 ms。" },
      { title: "量化与 TensorRT", body: "FP16/INT8 量化能显著提速，但要验证精度与校准集。INT8 的误差在边缘案例（小目标、逆光、雨雾）里最容易暴露。" },
      { title: "VIO 与视觉几何", body: "VIO 依赖特征/光流与 IMU；低纹理、运动模糊、卷帘快门与光照突变会让尺度漂移。机上必须能检测“估计不可信”。" },
      { title: "检测与跟踪", body: "检测给绝对位置，跟踪给时序一致性。无人机快速运动需要运动补偿、全局快门与合理的跟踪器；不要只追求 mAP。" },
      { title: "失效保护", body: "感知进程崩溃、相机断开、NPU 过热、内存耗尽都必须被监控。自主避障失效时要能悬停/降落/返航，而不是继续前飞。" },
    ],
    stack: [
      { layer: "算力平台", tools: ["Jetson Orin Nano Super", "RK3588", "Hailo-8L", "Qualcomm RB5"], note: "GPU/NPU/CPU 的功耗与生态差异。" },
      { layer: "推理", tools: ["TensorRT", "ONNX Runtime", "DeepStream", "HailoRT"], note: "量化、批处理、零拷贝与流水线。" },
      { layer: "视觉", tools: ["OpenCV", "Isaac ROS", "VPI", "GStreamer"], note: "采集、去畸变、深度、光流与编码。" },
      { layer: "模型", tools: ["YOLO", "ByteTrack", "Depth Anything", "SAM"], note: "检测/跟踪/深度/分割；注意授权与算力。" },
      { layer: "飞控接口", tools: ["MAVSDK", "MAVLink", "ROS 2", "uXRCE-DDS"], note: "设定点、速度限制、模式切换与 failsafe。" },
      { layer: "仿真", tools: ["Isaac Sim", "Gazebo", "Flightmare"], note: "相机噪声、运动模糊、光照与域随机化。" },
    ],
    build: [
      { step: "01", title: "功耗与热预算", detail: "测 Jetson/RK3588 的峰值/持续功耗，设计供电与风道；做 30 分钟满载热测试。", gate: "无降频、无欠压、机舱温度可控。" },
      { step: "02", title: "相机与时间", detail: "全局快门优先；测量曝光、传输、推理与飞控指令的时间戳。", gate: "端到端延迟与抖动可量化。" },
      { step: "03", title: "模型部署", detail: "训练/导出 ONNX，TensorRT 量化，验证精度与召回。", gate: "目标场景精度达标，边缘案例不崩。" },
      { step: "04", title: "VIO/避障闭环", detail: "VIO + 深度 + 局部规划，限制速度与倾斜；SITL 先跑通。", gate: "静态/动态障碍能停/绕。" },
      { step: "05", title: "真机与降级", detail: "低高度、护网、手动接管；注入相机断开、NPU 过热、推理超时。", gate: "每种失效都能安全降级。" },
    ],
    failures: [
      { mode: "热降频", cause: "机舱密闭、散热不足、环境高温、持续满载。", mitigation: "风道、散热片、功耗上限、温度监控与降级。" },
      { mode: "供电跌落", cause: "电池内阻、线径、瞬态电流、DC-DC 余量不足。", mitigation: "电源预算、电容、独立 BEC、欠压保护。" },
      { mode: "推理延迟抖动", cause: "GPU 共享、内存拷贝、批处理、热降频。", mitigation: "零拷贝、固定 pipeline、延迟预算、实时优先级。" },
      { mode: "模型漂移", cause: "光照/天气/场景变化、训练集偏差、量化误差。", mitigation: "在线监控、分布外检测、定期回标、保守策略。" },
      { mode: "VIO 失效", cause: "低纹理、运动模糊、卷帘快门、光照突变。", mitigation: "多传感器、曝光控制、失败检测、视觉/激光备份。" },
      { mode: "感知进程崩溃", cause: "内存泄漏、驱动、模型/库版本不匹配。", mitigation: "看门狗、进程隔离、资源限制、自动重启/降落。" },
    ],
    projects: [
      { name: "Isaac ROS", note: "GPU 加速 VSLAM/感知。", lang: "C++ / Python", href: "https://github.com/NVIDIA-ISAAC-ROS" },
      { name: "TensorRT", note: "推理优化与量化。", lang: "C++ / Python", href: "https://developer.nvidia.com/tensorrt" },
      { name: "DeepStream", note: "视频分析流水线。", lang: "C / C++", href: "https://developer.nvidia.com/deepstream-sdk" },
      { name: "OpenCV", note: "视觉基础库。", lang: "C++", href: "https://opencv.org/" },
      { name: "Ultralytics YOLO", note: "检测/分割/跟踪。", lang: "Python", href: "https://github.com/ultralytics/ultralytics" },
      { name: "VINS-Fusion", note: "VIO。", lang: "C++", href: "https://github.com/HKUST-Aerial-Robotics/VINS-Fusion" },
      { name: "OpenVINS", note: "滤波 VIO。", lang: "C++", href: "https://github.com/rpng/open_vins" },
      { name: "MAVSDK", note: "飞控接口。", lang: "C++ / Python", href: "https://github.com/mavlink/MAVSDK" },
    ],
    resources: [
      { title: "NVIDIA Jetson 文档", author: "NVIDIA", type: "文档", level: "核心", note: "功耗模式、JetPack、TensorRT、DeepStream。", href: "https://developer.nvidia.com/embedded-computing" },
      { title: "Isaac ROS 文档", author: "NVIDIA", type: "文档", level: "进阶", note: "VSLAM、深度、检测与 ROS 2 加速包。", href: "https://nvidia-isaac-ros.github.io/" },
      { title: "TensorRT 文档", author: "NVIDIA", type: "文档", level: "进阶", note: "量化、引擎构建与性能调优。", href: "https://docs.nvidia.com/deeplearning/tensorrt/" },
      { title: "OpenCV 文档", author: "OpenCV", type: "文档", level: "核心", note: "图像处理、标定、光流与深度。", href: "https://docs.opencv.org/" },
      { title: "ROS 2 文档", author: "ROS 2", type: "文档", level: "核心", note: "节点、QoS、TF2 与 rosbag。", href: "https://docs.ros.org/" },
      { title: "Computer Vision: Algorithms and Applications", author: "Szeliski", type: "书", level: "进阶", note: "视觉几何、特征、运动与三维重建。" },
      { title: "Deep Learning", author: "Goodfellow, Bengio & Courville", type: "书", level: "进阶", note: "深度学习基础与训练。" },
    ],
    trends: [
      { title: "边缘 Transformer / 基础模型", maturity: "research", detail: "轻量化 ViT、开放词汇检测与视觉语言模型开始上机，但功耗、延迟与可解释性仍是门槛。" },
      { title: "4D LiDAR 与事件相机", maturity: "early", detail: "更高点频、芯片化 LiDAR 与事件相机在高速/高动态场景有潜力，生态仍在成熟。" },
      { title: "NPU 异构计算", maturity: "production", detail: "Jetson、RK3588、Hailo 等把 CPU/GPU/NPU 组合到机载，关键是算子支持与工具链。" },
    ],
    learn: [
      { label: "阶段 03 · 状态估计", href: "/roadmap/#gnc" },
      { label: "C/C++ 工程 · GNC", href: "/flight-software/#gnc" },
      { label: "工程核心 · 飞船热/电源", href: "/engineering/spacecraft/" },
    ],
    boundaries:
      "本页不提供武器化、目标识别攻击或规避监管的指导。机载 AI 的输出必须受速度、空域与失效保护约束；涉及人脸/车牌/隐私数据时需遵守当地法律。",
    sources: [
      { label: "Jetson", href: "https://developer.nvidia.com/embedded-computing" },
      { label: "Isaac ROS", href: "https://nvidia-isaac-ros.github.io/" },
      { label: "TensorRT", href: "https://developer.nvidia.com/tensorrt" },
      { label: "DeepStream", href: "https://developer.nvidia.com/deepstream-sdk" },
      { label: "OpenCV", href: "https://opencv.org/" },
      { label: "Ultralytics", href: "https://github.com/ultralytics/ultralytics" },
      { label: "MAVSDK", href: "https://github.com/mavlink/MAVSDK" },
    ],
  },
  {
    slug: "swarm",
    index: "04",
    title: "蜂群与多机协同",
    en: "Swarm & Multi-Agent",
    accent: "blue",
    tagline: "一台无人机是控制问题，十台是时间、定位与通信问题。",
    summary:
      "Crazyflie + Crazyswarm2 + UWB 定位是研究与教学中最完整的开源蜂群栈；PX4/ArduPilot 多机与 ROS 2 更适合室外/任务级协同。蜂群的核心是相对定位、时间同步、冲突消解与任务分配。",
    stats: [
      { value: "10+", label: "典型规模", note: "室内 UWB" },
      { value: "3", label: "协同层", note: "定位 / 通信 / 协调" },
      { value: "1", label: "时间基", note: "同步决定编队" },
      { value: "0", label: "中央依赖", note: "去中心化是方向" },
    ],
    principles: [
      { title: "相对定位", body: "蜂群需要“我在编队里在哪”。UWB、视觉标记、LiDAR 或 GNSS RTK 各有精度/覆盖/成本权衡；室内常用 UWB。", formula: "p_i(t) − p_j(t) → 相对位置/距离" },
      { title: "时间同步", body: "编队、灯光秀与协同机动都依赖共同时间基。无线同步误差会直接变成位置误差；先测同步，再谈控制。" },
      { title: "一致性/编队", body: "一致性协议让个体收敛到共同状态；编队控制叠加期望相对位置。通信拓扑、延迟与丢包决定收敛性。" },
      { title: "碰撞避免", body: "局部避碰（速度障碍、ORCA、势场）与全局规划要分层。高密度编队不能只靠“各自避让”。" },
      { title: "任务分配", body: "拍卖、匈牙利、CBBA 等算法把任务分给个体；通信受限时要能分布式重分配。" },
      { title: "射频拥塞", body: "几十台设备共享 2.4 GHz 时，控制链路、图传、Wi-Fi、UWB 会互相干扰。信道规划与功率控制是硬约束。" },
    ],
    stack: [
      { layer: "平台", tools: ["Crazyflie 2.1 Brushless", "PX4", "ArduPilot"], note: "室内小型机 / 室外多旋翼。" },
      { layer: "定位", tools: ["UWB Loco Positioning", "VICON", "RTK GNSS", "视觉标记"], note: "精度、覆盖、成本与部署难度。" },
      { layer: "通信", tools: ["Crazyradio", "ESP-NOW", "Wi-Fi", "MAVLink", "mesh"], note: "控制、遥测、时间同步与多机数据。" },
      { layer: "框架", tools: ["Crazyswarm2", "ROS 2", "MAVSDK"], note: "编队、轨迹、多机 API 与仿真。" },
      { layer: "算法", tools: ["一致性", "ORCA", "CBBA", "MPC"], note: "编队、避碰、任务分配与轨迹优化。" },
      { layer: "仿真", tools: ["Crazyswarm2 sim", "Gazebo", "Isaac Sim"], note: "多机物理与通信仿真。" },
    ],
    build: [
      { step: "01", title: "单机稳定", detail: "一台 Crazyflie 在 UWB 下稳定悬停、轨迹跟踪与安全降落。", gate: "位置误差/超调在指标内，急停有效。" },
      { step: "02", title: "三机编队", detail: "共享时间基、分配 ID、做三角形/直线编队。", gate: "相对位置误差与碰撞距离达标。" },
      { step: "03", title: "十机规模", detail: "信道规划、UWB 更新率、广播拥塞、集中/分布式调度。", gate: "无丢机、无碰撞、可一键降落。" },
      { step: "04", title: "任务与避碰", detail: "加入任务分配、动态障碍与失效个体退出。", gate: "单机失效不影响整体安全。" },
      { step: "05", title: "室外/多源", detail: "RTK/视觉/ LiDAR 组合，风与通信距离测试。", gate: "在风与丢包下仍能收敛。" },
    ],
    failures: [
      { mode: "UWB 多径/遮挡", cause: "金属、人体、墙角造成 NLOS 与跳变。", mitigation: "基站布局、滤波、冗余测距、视觉辅助。" },
      { mode: "时间同步丢失", cause: "无线拥塞、时钟漂移、主节点失效。", mitigation: "PTP/无线同步、备份主节点、漂移监测。" },
      { mode: "通信拥塞", cause: "几十台设备共享信道、广播风暴、图传干扰。", mitigation: "信道规划、TDMA、功率控制、数据降频。" },
      { mode: "编队碰撞", cause: "相对定位误差、延迟、避碰参数不当。", mitigation: "最小间距、速度障碍、分层避碰、急停。" },
      { mode: "单机失效", cause: "电池、桨、通信、定位丢失。", mitigation: "失效检测、退出编队、受控降落、隔离空域。" },
    ],
    projects: [
      { name: "Crazyswarm2", note: "ROS 2 多机蜂群框架。", lang: "Python / C++", href: "https://github.com/IMRCLab/crazyswarm2" },
      { name: "crazyflie-firmware", note: "Crazyflie 固件。", lang: "C", href: "https://github.com/bitcraze/crazyflie-firmware" },
      { name: "crazyflie-lib-python", note: "Python 控制库。", lang: "Python", href: "https://github.com/bitcraze/crazyflie-lib-python" },
      { name: "Loco Positioning", note: "UWB 室内定位。", lang: "硬件/固件", href: "https://www.bitcraze.io/products/loco-positioning-system/" },
      { name: "PX4", note: "多机 SITL/室外。", lang: "C++", href: "https://github.com/PX4/PX4-Autopilot" },
      { name: "ArduPilot", note: "多机与任务。", lang: "C++", href: "https://github.com/ArduPilot/ardupilot" },
      { name: "ROS 2", note: "多机通信与协调。", lang: "C++ / Python", href: "https://docs.ros.org/" },
    ],
    resources: [
      { title: "Crazyswarm2 文档", author: "IMRCLab", type: "文档", level: "核心", note: "多机编队、轨迹、仿真与硬件。", href: "https://imrclab.github.io/crazyswarm2/" },
      { title: "Bitcraze 文档", author: "Bitcraze", type: "文档", level: "核心", note: "Crazyflie、Crazyradio、UWB 与扩展。", href: "https://www.bitcraze.io/documentation/" },
      { title: "ROS 2 文档", author: "ROS 2", type: "文档", level: "核心", note: "多机 DDS、命名空间、QoS 与时钟。", href: "https://docs.ros.org/" },
      { title: "MAVLink", author: "MAVLink", type: "文档", level: "核心", note: "多机 sysid/compid、路由与心跳。", href: "https://mavlink.io/" },
      { title: "Swarm Robotics: A Formal Approach", author: "Heiko Hamann", type: "书", level: "进阶", note: "蜂群建模、自组织与形式化方法。" },
      { title: "Graph Theoretic Methods in Multiagent Networks", author: "Mesbahi & Egerstedt", type: "书", level: "进阶", note: "图论、一致性、网络化控制系统。" },
    ],
    trends: [
      { title: "去中心化蜂群", maturity: "research", detail: "从中央调度走向局部交互与分布式共识，提升规模与鲁棒性。" },
      { title: "UWB + 视觉 + 惯性融合", maturity: "early", detail: "室内高精度定位从单一 UWB 走向多源融合，以对抗 NLOS 与遮挡。" },
      { title: "灯光秀/编队商业化", maturity: "production", detail: "大规模编队已用于表演与物流试验，核心是时间同步、路径规划与失效安全。" },
    ],
    learn: [
      { label: "阶段 02 · 控制理论", href: "/roadmap/#control" },
      { label: "C/C++ 工程 · 实时系统", href: "/flight-software/#realtime" },
      { label: "工程核心 · 轨道/星座", href: "/engineering/orbits/" },
    ],
    boundaries:
      "本页不提供用于攻击、干扰或非法集群行动的指导。蜂群飞行涉及空域、频谱、隐私与安全；室外多机必须遵守当地法规并取得必要许可。",
    sources: [
      { label: "Crazyswarm2", href: "https://imrclab.github.io/crazyswarm2/" },
      { label: "Bitcraze", href: "https://www.bitcraze.io/documentation/" },
      { label: "Crazyflie firmware", href: "https://github.com/bitcraze/crazyflie-firmware" },
      { label: "ROS 2", href: "https://docs.ros.org/" },
      { label: "MAVLink", href: "https://mavlink.io/" },
      { label: "PX4", href: "https://github.com/PX4/PX4-Autopilot" },
    ],
  },
  {
    slug: "safety",
    index: "05",
    title: "空域、安全与反制",
    en: "Airspace, Security & Counter-UAS",
    accent: "red",
    tagline: "能飞只是开始；合法、可控、可追溯才是系统。",
    summary:
      "Remote ID、地理围栏、失效保护、探测与避让、MAVLink 签名与射频安全构成无人机系统的“可信边界”。反无人机是防御与合规问题，不是教你做干扰器。",
    stats: [
      { value: "3", label: "安全支柱", note: "识别 / 围栏 / 失效保护" },
      { value: "2", label: "风险域", note: "射频 / 网络" },
      { value: "1", label: "底线", note: "不干扰、不攻击" },
      { value: "24/7", label: "空域态势", note: "BVLOS 需要持续感知" },
    ],
    principles: [
      { title: "Remote ID 与可追溯", body: "Remote ID 让监管与公众能识别无人机身份、位置与操作者。Open Drone ID 是开源实现；合规是飞行前提，不是可选项。" },
      { title: "地理围栏", body: "围栏是最后一道软件限制，不是唯一安全措施。必须在飞控、地面站与任务层同时配置，并验证越界行为。" },
      { title: "失效保护", body: "链路丢失、GPS 丢失、低电量、避障失效、伴飞计算机崩溃都要有明确动作：悬停、返航、降落或终止任务。" },
      { title: "探测与避让", body: "DAA 需要感知（雷达/ADS-B/视觉/声学）、跟踪、威胁评估与机动决策。它不是“装个 ADS-B 接收机”就完成。" },
      { title: "MAVLink 安全", body: "MAVLink 2 支持消息签名，能防篡改/重放；但密钥管理、时间同步与地面站安全同样重要。不要裸露调试端口。" },
      { title: "反无人机边界", body: "干扰、欺骗、劫持与动能拦截在多数司法辖区受严格限制，且可能影响民航/公共安全。防御方应优先采用探测、报告、隔离与执法协同。" },
    ],
    stack: [
      { layer: "识别", tools: ["Remote ID", "Open Drone ID", "ADS-B In"], note: "身份、位置、操作者与空域态势。" },
      { layer: "飞控保护", tools: ["PX4 failsafe", "ArduPilot failsafe", "geofence"], note: "链路/GPS/电量/围栏/避障失效动作。" },
      { layer: "链路安全", tools: ["MAVLink signing", "ELRS bind phrase", "加密图传"], note: "签名/绑定/加密不是同一层：绑定短语主要防误连，不提供强加密。" },
      { layer: "探测", tools: ["雷达", "RF 监测", "EO/IR", "声学"], note: "探测不是反制；先发现、识别、记录。" },
      { layer: "空域", tools: ["U-space", "LAANC", "NOTAM", "DAA"], note: "法规、空域协调与超视距。" },
      { layer: "响应", tools: ["SOP", "日志", "执法协同", "保险"], note: "事件响应、取证与复盘。" },
    ],
    build: [
      { step: "01", title: "合规清单", detail: "确认重量/类别、注册、Remote ID、操作者证书、空域与保险。", gate: "每一项有文件与责任人。" },
      { step: "02", title: "围栏与 failsafe", detail: "配置高度/半径/禁飞区；逐项测试链路/GPS/低电量/避障失效。", gate: "每类失效都能进入预期状态。" },
      { step: "03", title: "链路安全", detail: "启用 MAVLink 签名/ELRS 绑定；关闭不必要的调试端口；密钥轮换。", gate: "未授权地面站无法注入指令。" },
      { step: "04", title: "DAA/态势", detail: "接入 ADS-B/雷达/视觉，定义告警与机动策略。", gate: "告警到动作的时间可测量。" },
      { step: "05", title: "事件响应", detail: "坠机/失控/入侵/隐私事件的报告、取证与复盘流程。", gate: "演练一次完整响应。" },
    ],
    failures: [
      { mode: "飞丢/越界", cause: "围栏配置错误、GPS 漂移、链路丢失、操作失误。", mitigation: "多重围栏、RTH 高度、日志、预飞检查。" },
      { mode: "GPS 欺骗/干扰", cause: "恶意射频或环境干扰，定位跳变。", mitigation: "多源导航、一致性检测、视觉/惯导备份、告警。" },
      { mode: "未授权接管", cause: "弱口令、开放 MAVLink/UDP、未签名链路。", mitigation: "签名、密钥、网络隔离、最小暴露面。" },
      { mode: "空域冲突", cause: "未查 NOTAM/临时禁飞、超视距、未协调。", mitigation: "空域查询、DAA、观察员、限高限区。" },
      { mode: "隐私/数据", cause: "相机拍到人脸/车牌、日志泄露。", mitigation: "数据最小化、脱敏、访问控制、保留期限。" },
      { mode: "反制误伤", cause: "非法干扰影响民航/其他设备。", mitigation: "合法探测、报告与执法协同；不自行干扰。" },
    ],
    projects: [
      { name: "Open Drone ID", note: "开源 Remote ID 实现。", lang: "C / Android", href: "https://github.com/opendroneid" },
      { name: "PX4 Safety", note: "failsafe/geofence 文档。", lang: "C++", href: "https://docs.px4.io/main/en/config/safety.html" },
      { name: "ArduPilot Failsafe", note: "失效保护配置。", lang: "C++", href: "https://ardupilot.org/copter/docs/failsafe-landing-page.html" },
      { name: "MAVLink Signing", note: "消息签名与安全。", lang: "C", href: "https://mavlink.io/en/guide/message_signing.html" },
      { name: "QGroundControl", note: "围栏/参数/日志。", lang: "C++", href: "https://github.com/mavlink/qgroundcontrol" },
      { name: "ArduPilot ADS-B", note: "ADS-B 态势接入。", lang: "C++", href: "https://ardupilot.org/copter/docs/common-ads-b-receiver.html" },
    ],
    resources: [
      { title: "FAA Remote ID", author: "FAA", type: "标准", level: "核心", note: "美国 Remote ID 要求与合规入口。", href: "https://www.faa.gov/uas/getting_started/remote_id" },
      { title: "EASA Drones", author: "EASA", type: "标准", level: "核心", note: "欧盟 Open/Specific/Certified 与 U-space。", href: "https://www.easa.europa.eu/en/light/topics/drones" },
      { title: "Open Drone ID", author: "Open Drone ID", type: "文档", level: "核心", note: "Remote ID 开源实现与测试工具。", href: "https://github.com/opendroneid" },
      { title: "MAVLink Security", author: "MAVLink", type: "文档", level: "核心", note: "签名、密钥与安全实践。", href: "https://mavlink.io/en/guide/message_signing.html" },
      { title: "PX4 Safety", author: "PX4", type: "文档", level: "核心", note: "failsafe、geofence、RTL 与降落。", href: "https://docs.px4.io/main/en/config/safety.html" },
      { title: "ArduPilot Failsafe", author: "ArduPilot", type: "文档", level: "核心", note: "各机型失效保护配置。", href: "https://ardupilot.org/copter/docs/failsafe-landing-page.html" },
    ],
    trends: [
      { title: "BVLOS 与 U-space", maturity: "early", detail: "超视距运行依赖 Remote ID、DAA、空域服务与运行风险评估；规则仍在快速演进。" },
      { title: "DAA 多传感器融合", maturity: "early", detail: "ADS-B + 雷达 + 视觉/声学组合，用于非合作目标；成本和误报仍是难点。" },
      { title: "反无人机防御体系", maturity: "production", detail: "探测、识别、跟踪、报告与执法协同；干扰/拦截受严格法律限制。" },
    ],
    learn: [
      { label: "阶段 05 · 验证与安全", href: "/roadmap/#systems" },
      { label: "C/C++ 工程 · 通信与安全", href: "/flight-software/#comms" },
      { label: "工业前沿 · 防务与合规", href: "/industry/" },
    ],
    boundaries:
      "本页只讨论合规、防御与安全工程，不提供干扰、欺骗、劫持、武器化或规避监管的操作指导。反无人机行动必须由依法授权的机构在合法框架内实施。",
    sources: [
      { label: "FAA Remote ID", href: "https://www.faa.gov/uas/getting_started/remote_id" },
      { label: "EASA Drones", href: "https://www.easa.europa.eu/en/light/topics/drones" },
      { label: "Open Drone ID", href: "https://github.com/opendroneid" },
      { label: "MAVLink Signing", href: "https://mavlink.io/en/guide/message_signing.html" },
      { label: "PX4 Safety", href: "https://docs.px4.io/main/en/config/safety.html" },
      { label: "ArduPilot Failsafe", href: "https://ardupilot.org/copter/docs/failsafe-landing-page.html" },
    ],
  },
];

export const DRONE_LAYERS = [
  { index: "01", title: "机体与动力", detail: "机架、电机、ESC、桨、电池；决定推重比、惯量与散热。" },
  { index: "02", title: "飞控", detail: "PX4 / ArduPilot / Betaflight；IMU、气压、磁、GNSS 与执行器。" },
  { index: "03", title: "估计与控制", detail: "EKF、姿态/位置/角速率环、失效保护与模式管理。" },
  { index: "04", title: "自主与感知", detail: "ROS 2、VIO/SLAM、规划、避障、目标检测与跟踪。" },
  { index: "05", title: "通信", detail: "ELRS/Crossfire、MAVLink、Wi-Fi/4G/5G、HD 图传与 Remote ID。" },
  { index: "06", title: "地面与云", detail: "QGC/Mission Planner、日志、MAVSDK、云端任务与数据。" },
];

export const DRONE_TRENDS: DroneTrend[] = [
  { title: "边缘 AI 成为标配", maturity: "production", detail: "Jetson Orin Nano Super、RK3588、Hailo-8L 把检测/VIO/跟踪放到机上；功耗与散热是主约束。" },
  { title: "Sim-to-Real 与大规模回归", maturity: "early", detail: "Isaac Sim/Isaac Lab、Gazebo、Flightmare 让感知与控制先在仿真里跑上千次。" },
  { title: "开放标准与中间件", maturity: "production", detail: "MAVLink 2、uXRCE-DDS、Zenoh、Remote ID 把飞控、伴飞计算机与云端解耦。" },
  { title: "BVLOS 与无人机物流", maturity: "early", detail: "超视距、DAA、空域服务与 Remote ID 是规模化的前提，法规仍在演进。" },
  { title: "蜂群与多机协同", maturity: "research", detail: "Crazyflie/Crazyswarm2 让十机级实验可复现；去中心化与鲁棒协同仍是研究前沿。" },
  { title: "安全与反制", maturity: "production", detail: "MAVLink 签名、Remote ID、地理围栏与 DAA 成为系统设计输入；反制必须合法合规。" },
];

export const DRONE_BUILDS = [
  { title: "5 寸 FPV", detail: "Betaflight + ELRS + HD 图传；练手动、调参与黑盒。", weeks: "2–4 周" },
  { title: "PX4 自主机", detail: "Gazebo SITL → Offboard → VIO → 避障；练 GNC 与 ROS 2。", weeks: "4–8 周" },
  { title: "Jetson 伴飞", detail: "相机 + TensorRT + VIO + MAVSDK；练功耗、延迟与失效。", weeks: "4–8 周" },
  { title: "Crazyflie 蜂群", detail: "UWB + Crazyswarm2；从 1 台到 10 台编队。", weeks: "4–8 周" },
  { title: "合规 BVLOS", detail: "Remote ID + 围栏 + DAA + 运行手册；先合规再飞。", weeks: "持续" },
];
