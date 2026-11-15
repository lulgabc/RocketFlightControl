export type OrgKind = "商业公司" | "政府机构";
export type Accent = "orange" | "teal" | "gold" | "blue" | "red" | "violet" | "green";

export interface IndustryOrg {
  slug: string;
  name: string;
  nameZh: string;
  short: string;
  kind: OrgKind;
  country: string;
  founded: string;
  hq: string;
  accent: Accent;
  tagline: string;
  summary: string;
  focus: string[];
  stats: { value: string; label: string; note?: string }[];
  snapshot: { date: string; title: string; detail: string }[];
  programs: { name: string; status: string; note: string; href?: string }[];
  stack: { area: string; detail: string; evidence: string }[];
  research: { title: string; detail: string }[];
  openProjects: { name: string; note: string; href: string }[];
  sources: { label: string; href: string }[];
  boundaries: string;
  learn: { label: string; href: string }[];
  compare: {
    launch: string;
    human: string;
    signature: string;
    openness: string;
  };
}

export const INDUSTRY_ORGS: IndustryOrg[] = [
  {
    slug: "spacex",
    name: "SpaceX",
    nameZh: "太空探索技术公司",
    short: "SpaceX",
    kind: "商业公司",
    country: "美国",
    founded: "2002",
    hq: "Starbase, Texas（总部）",
    accent: "orange",
    tagline: "可复用运载、Starlink 与 Starship",
    summary:
      "以可复用运载、Starlink 星座与 Starship 为核心的纵向整合公司。2026 年 Starship 首次入轨并首次用发射塔回收飞船，同时继续验证助推器回收与高频复用；Falcon 9 / Dragon 仍是当前主力。",
    focus: ["可复用运载", "Starlink", "Starship / HLS", "载人航天", "火星运输"],
    stats: [
      { value: "2002", label: "成立", note: "美国 · Starbase" },
      { value: "15", label: "Starship 飞行", note: "截至 2026-11-14" },
      { value: "26", label: "Starlink V3 / 次", note: "Flight 14 / 15" },
      { value: "3×2", label: "x86 飞行计算机", note: "公开的 Falcon 9 架构" },
    ],
    snapshot: [
      {
        date: "2026-09-28",
        title: "Starship Flight 14 首次入轨",
        detail:
          "Starship 首次进入地球轨道并部署 26 颗 Starlink V3 卫星，标志从亚轨道试飞进入轨道任务阶段。",
      },
      {
        date: "2026-11-13/14",
        title: "Flight 15 首次回收飞船",
        detail:
          "飞船在约 22.5 小时、14 圈飞行后返回 Starbase，被发射塔机械臂首次夹住；Super Heavy 助推器因制导问题放弃回收，溅落海面。",
      },
      {
        date: "2026",
        title: "Starlink V3 开始部署",
        detail:
          "V3 卫星单次由 Starship 批量部署，目标是显著提升星座容量与用户速率；具体在轨性能仍待长期运行数据。",
      },
      {
        date: "2026",
        title: "HLS 继续开发",
        detail:
          "NASA 的 Artemis 计划仍依赖 SpaceX 的 Starship HLS；2026 年调整后，Artemis IV（2028）首次载人着陆的着陆器将在 SpaceX 与 Blue Origin 之间确定。",
      },
    ],
    programs: [
      {
        name: "Falcon 9",
        status: "运营中",
        note: "部分可复用中型运载，当前发射主力；LEO 运力约 22.8 t（一次性）。",
        href: "https://www.spacex.com/vehicles/falcon-9/",
      },
      {
        name: "Falcon Heavy",
        status: "运营中",
        note: "重型运载，用于高能轨道与大型科学任务。",
        href: "https://www.spacex.com/vehicles/falcon-heavy/",
      },
      {
        name: "Dragon",
        status: "运营中",
        note: "载人与货运飞船，服务 ISS 与商业任务。",
        href: "https://www.spacex.com/vehicles/dragon/",
      },
      {
        name: "Starship",
        status: "试飞 / 初始运营",
        note: "全复用超重型运载；Flight 14 首次入轨，Flight 15 首次回收飞船。",
        href: "https://www.spacex.com/launches/starship-flight-15",
      },
      {
        name: "Starlink",
        status: "运营中",
        note: "低轨宽带星座；V3 卫星 2026 年开始由 Starship 部署。",
        href: "https://www.starlink.com/",
      },
      {
        name: "HLS（Starship）",
        status: "开发中",
        note: "NASA 载人着陆系统合同之一，用于 Artemis 后续月面任务。",
        href: "https://www.nasa.gov/humans-in-space/human-landing-system/",
      },
    ],
    stack: [
      {
        area: "飞行软件",
        detail:
          "公开资料显示 Falcon 9 使用三台双核 x86 计算机，每核一个 Linux 实例，飞控以 C/C++ 编写，并用 Actor-Judge 模式做命令仲裁。",
        evidence: "公开 AMA / 报道",
      },
      {
        area: "推进",
        detail:
          "Raptor 采用液氧/甲烷全流量分级燃烧循环；Merlin 为煤油/液氧燃气发生器循环。",
        evidence: "官方 / 公开资料",
      },
      {
        area: "结构",
        detail:
          "Starship 采用不锈钢箭体与快速迭代制造；Falcon 9 为铝锂合金与可复用助推器。",
        evidence: "官方",
      },
      {
        area: "通信",
        detail:
          "Starlink 星座提供宽带与星间链路；Starship 任务已公开演示通过 Starlink 回传视频与遥测。",
        evidence: "官方 / 任务更新",
      },
      {
        area: "研发模式",
        detail:
          "高度纵向整合、快速原型与飞行迭代；大量系统自研，供应链与软件细节不公开。",
        evidence: "公开报道",
      },
    ],
    research: [
      { title: "全复用与快速周转", detail: "助推器、飞船回收后的检查、翻修与再飞周期，是降低单位成本的关键。" },
      { title: "在轨推进剂转移", detail: "Starship HLS 与火星任务都依赖低温推进剂在轨转移，尚未公开完成全尺寸演示。" },
      { title: "火星进入、下降与着陆", detail: "火星大气稀薄，需要气动减速、超声速反推与精确制导的组合。" },
      { title: "Starlink V3 与空间通信", detail: "更大容量、更高带宽与星间链路，把火箭与通信业务绑定成飞轮。" },
    ],
    openProjects: [
      { name: "Starship Flight 15", note: "官方任务页：26 颗 V3、首次飞船回收。", href: "https://www.spacex.com/launches/starship-flight-15" },
      { name: "SpaceX Updates", note: "任务与系统更新的官方入口。", href: "https://www.spacex.com/updates" },
      { name: "NASA HLS", note: "NASA 载人着陆系统项目与合同背景。", href: "https://www.nasa.gov/humans-in-space/human-landing-system/" },
      { name: "SpaceX 软件 AMA 摘要", note: "公开讨论飞控架构、Linux、C++ 与 Actor-Judge。", href: "https://www.reddit.com/r/spacex/comments/nd9ipw/summary_of_spacex_software_ama/" },
    ],
    sources: [
      { label: "SpaceX Updates", href: "https://www.spacex.com/updates" },
      { label: "Starship Flight 15", href: "https://www.spacex.com/launches/starship-flight-15" },
      { label: "SpaceX Starship", href: "https://www.spacex.com/vehicles/starship/" },
      { label: "SpaceX Falcon 9", href: "https://www.spacex.com/vehicles/falcon-9/" },
      { label: "SpaceX 软件 AMA 摘要", href: "https://www.reddit.com/r/spacex/comments/nd9ipw/summary_of_spacex_software_ama/" },
      { label: "NASA HLS", href: "https://www.nasa.gov/humans-in-space/human-landing-system/" },
    ],
    boundaries:
      "飞控源码、控制器参数、内核配置、故障阈值与 CVXGEN 模型均未公开；本页只采用官方任务页、公开 AMA、监管文件与主流报道。",
    learn: [
      { label: "C/C++ 飞控与通信专线", href: "/flight-software/" },
      { label: "工程核心 · 火箭发动机", href: "/engineering/propulsion/" },
      { label: "阶段 03 · 导航、估计与制导", href: "/roadmap/#gnc" },
      { label: "项目 12 · 垂直回收", href: "/projects/#landing" },
    ],
    compare: {
      launch: "Falcon 9 / Heavy / Starship",
      human: "Dragon / Starship HLS",
      signature: "Starlink V3 + 飞船回收",
      openness: "架构公开片段，源码不公开",
    },
  },
  {
    slug: "blue-origin",
    name: "Blue Origin",
    nameZh: "蓝色起源",
    short: "Blue Origin",
    kind: "商业公司",
    country: "美国",
    founded: "2000",
    hq: "Kent, Washington",
    accent: "blue",
    tagline: "BE-4、New Glenn 与 Blue Moon",
    summary:
      "以 BE-4/BE-7 发动机、New Glenn 重型可复用火箭与 Blue Moon 月面着陆器为核心的商业航天公司。2026 年 4 月首次实现 New Glenn 助推器复用，5 月 NG-4 地面静态点火爆炸，复飞推迟至 2027 年 1 月，Blue Moon MK1 也随之后移。",
    focus: ["重型可复用运载", "液氧甲烷 / 液氢发动机", "月面着陆", "太空基础设施"],
    stats: [
      { value: "2000", label: "成立", note: "美国 · Kent, WA" },
      { value: "98 m", label: "New Glenn 高度", note: "7×2 构型" },
      { value: "45 t", label: "LEO 运力", note: "7×2 构型公开目标" },
      { value: "2027-01", label: "复飞目标", note: "NG-4 爆炸后" },
    ],
    snapshot: [
      {
        date: "2025-01-16",
        title: "New Glenn 首飞入轨",
        detail: "NG-1 将 Blue Ring Pathfinder 送入轨道，助推器未回收。",
      },
      {
        date: "2025-11",
        title: "NG-2 发射 ESCAPADE",
        detail: "New Glenn 第二次飞行将 NASA 双星 ESCAPADE 送往火星转移轨道，并首次在海上回收助推器。",
      },
      {
        date: "2026-04-19",
        title: "NG-3 首次复用助推器",
        detail: "New Glenn 第三次飞行成功复用助推器，是 Blue Origin 可复用能力的关键里程碑。",
      },
      {
        date: "2026-05-28",
        title: "NG-4 静态点火爆炸",
        detail:
          "New Glenn 在 LC-36 静态点火时爆炸，火箭与发射台受损。CEO 后续表示异常起源于一台 BE-4 的主氧阀。",
      },
      {
        date: "2026-10/11",
        title: "GS3 与 Northstar 公布",
        detail:
          "Blue Origin 公布 New Glenn 第三级 GS3（BE-7 动力、碳纤维液氢贮箱）与新一级发动机 Northstar，目标降低制造成本、提升高能轨道能力。",
      },
      {
        date: "2026-11-12",
        title: "Orbital Reef 暂停",
        detail: "Blue Origin 决定不再竞标 NASA 商业空间站 Phase 2，把资源集中到月球任务。",
      },
    ],
    programs: [
      { name: "New Glenn", status: "复飞准备", note: "7×BE-4 可复用重型火箭；NG-3 已复用助推器，NG-4 爆炸后目标 2027-01 复飞。", href: "https://www.blueorigin.com/new-glenn" },
      { name: "New Shepard", status: "运营中", note: "亚轨道载人与科研飞行。", href: "https://www.blueorigin.com/new-shepard" },
      { name: "BE-4", status: "运营中", note: "液氧/甲烷富氧分级燃烧发动机；New Glenn 7 台，ULA Vulcan 2 台。", href: "https://www.blueorigin.com/engines" },
      { name: "BE-7", status: "运营 / 开发", note: "液氧/液氢上面级与着陆发动机，用于 Blue Moon 与 GS3。", href: "https://www.blueorigin.com/engines" },
      { name: "GS3", status: "开发中", note: "New Glenn 第三级，面向 GEO 直送、月球与深空任务。", href: "https://www.blueorigin.com/news/new-glenn-expands-reach-with-gs3" },
      { name: "Blue Moon MK1", status: "测试 / 首飞待定", note: "3 t 级货物月面着陆器；Endurance 任务因 New Glenn 爆炸推迟。", href: "https://www.blueorigin.com/blue-moon" },
      { name: "Blue Moon MK2", status: "开发中", note: "载人月面着陆器，NASA HLS 合同之一，计划用于 Artemis V。", href: "https://www.blueorigin.com/blue-moon" },
      { name: "Orbital Reef", status: "暂停", note: "商业空间站方案；2026-11 停止竞标 NASA Phase 2。", href: "https://www.blueorigin.com/news/orbital-reef-commercial-space-station" },
    ],
    stack: [
      { area: "推进", detail: "BE-4：液氧/甲烷、富氧分级燃烧、可深度节流；BE-7：液氧/液氢、双膨胀循环，适合长时多次点火。", evidence: "官方" },
      { area: "复用", detail: "New Glenn 一级设计为可复用；NG-3 首次复用助推器，NG-4 事故打断节奏。", evidence: "官方 / 任务报告" },
      { area: "制造", detail: "BE-4 大量采用增材制造部件；GS3 使用碳纤维液氢贮箱，强调降低零件数与成本。", evidence: "官方 / 公开报道" },
      { area: "月面系统", detail: "Blue Moon MK1 单 BE-7、3 t 货物；MK2 为载人构型，参与 NASA HLS。", evidence: "官方" },
      { area: "软件与航电", detail: "飞控软件、航电架构与故障管理细节未公开；公开信息集中在发动机、结构与任务。", evidence: "未公开" },
    ],
    research: [
      { title: "低成本重型发动机", detail: "Northstar 目标把一级发动机成本降到 BE-4 的四分之一，同时提高推力与复用性。" },
      { title: "月面着陆与货物运输", detail: "MK1 面向 3 t 级货物、任意月面地点；MK2 面向载人与 Artemis。" },
      { title: "高能轨道与深空", detail: "GS3 用 BE-7 与碳纤维贮箱执行 GEO 直送、月球与行星任务。" },
      { title: "在轨基础设施", detail: "Blue Ring 提供托管、机动与部署服务；Orbital Reef 暂停后，重点转向月球。" },
    ],
    openProjects: [
      { name: "New Glenn", note: "官方火箭页面与任务信息。", href: "https://www.blueorigin.com/new-glenn" },
      { name: "Blue Moon", note: "MK1/MK2 着陆器与任务设计。", href: "https://www.blueorigin.com/blue-moon" },
      { name: "Engines", note: "BE-4 / BE-7 / BE-3U 的官方说明。", href: "https://www.blueorigin.com/engines" },
      { name: "GS3", note: "第三级与高能任务能力。", href: "https://www.blueorigin.com/news/new-glenn-expands-reach-with-gs3" },
    ],
    sources: [
      { label: "Blue Origin New Glenn", href: "https://www.blueorigin.com/new-glenn" },
      { label: "Blue Origin Blue Moon", href: "https://www.blueorigin.com/blue-moon" },
      { label: "Blue Origin Engines", href: "https://www.blueorigin.com/engines" },
      { label: "GS3 公告", href: "https://www.blueorigin.com/news/new-glenn-expands-reach-with-gs3" },
      { label: "CNN：New Glenn 爆炸", href: "https://www.cnn.com/2026/05/28/science/blue-origin-rocket-anomaly" },
      { label: "Spaceflight Now：BE-4 氧阀", href: "https://spaceflightnow.com/2026/08/06/blue-origin-identifies-engine-issue-behind-new-glenn-explosion" },
      { label: "NASA HLS", href: "https://www.nasa.gov/humans-in-space/human-landing-system/" },
    ],
    boundaries:
      "飞控软件、航电与故障管理细节未公开；爆炸原因来自 CEO 公开表述与 recoverable hardware 检查，最终报告可能继续更新。",
    learn: [
      { label: "阶段 01 · 飞行动力学", href: "/roadmap/#dynamics" },
      { label: "工程核心 · 火箭发动机", href: "/engineering/propulsion/" },
      { label: "阶段 04 · 嵌入式飞控", href: "/roadmap/#embedded" },
      { label: "工程核心 · 结构材料", href: "/engineering/structures/" },
      { label: "项目 11 · 探空火箭", href: "/projects/#sounding" },
    ],
    compare: {
      launch: "New Glenn（复飞准备）",
      human: "New Shepard / Blue Moon MK2",
      signature: "BE-4 + 首次助推器复用",
      openness: "硬件与任务公开，软件不公开",
    },
  },
  {
    slug: "rocket-lab",
    name: "Rocket Lab",
    nameZh: "火箭实验室",
    short: "Rocket Lab",
    kind: "商业公司",
    country: "美国 / 新西兰",
    founded: "2006",
    hq: "Long Beach, California",
    accent: "teal",
    tagline: "Electron、Neutron 与 Photon",
    summary:
      "以小运载 Electron、可复用中型 Neutron 与 Photon  spacecraft 为核心的端到端航天公司。2026 年 Electron 达到 100 次发射，Neutron 因碳纤维前穹顶问题推迟到 2027；同时通过 GEOST、Mynaric 与 Flatellite 向载荷、激光通信与国家安全星座扩张。",
    focus: ["小运载", "可复用中型运载", "航天器平台", "激光通信", "国家安全载荷"],
    stats: [
      { value: "2006", label: "成立", note: "美国 / 新西兰" },
      { value: "100", label: "Electron 发射", note: "2026-11-14" },
      { value: "13 t", label: "Neutron LEO", note: "官方目标" },
      { value: "2027", label: "Neutron 首飞", note: "最新公开计划" },
    ],
    snapshot: [
      { date: "2025-08", title: "完成 GEOST 收购", detail: "以约 2.75 亿美元收购 EO/IR 载荷公司 GEOST，进入国家安全载荷市场。" },
      { date: "2026-04-14", title: "完成 Mynaric 收购", detail: "获得激光光通信终端能力，补齐星座与国家安全任务的数据链路。" },
      { date: "2026-08-04", title: "Flatellite 合同", detail: "美国太空军授予 3.97 亿美元合同，设计、制造、发射并运营 Flatellite 星座。" },
      { date: "2026-08-10", title: "GHOST 公布", detail: "可部署发射场系统，把 Electron / HASTE 的响应式发射能力扩展到全球。" },
      { date: "2026-10-15", title: "Neutron 推迟至 2027", detail: "碳纤维一级前穹顶制造问题导致首飞延期；Archimedes 发动机完成热试。" },
      { date: "2026-11-14", title: "Electron 第 100 次发射", detail: "为 iQPS 发射 QPS-SAR-19 雷达成像卫星，成为最快达到 100 次的商业火箭。" },
    ],
    programs: [
      { name: "Electron", status: "运营中", note: "小型运载，LEO 约 300 kg；Rutherford 电动泵发动机。", href: "https://rocketlabcorp.com/launch/electron" },
      { name: "HASTE", status: "运营中", note: "基于 Electron 的亚轨道高超声速试验平台。", href: "https://rocketlabcorp.com/launch/haste" },
      { name: "Neutron", status: "开发中", note: "可复用中型运载，LEO 13 t，9 台 Archimedes；首飞 2027。", href: "https://rocketlabcorp.com/launch/neutron" },
      { name: "Archimedes", status: "测试中", note: "液氧/甲烷富氧分级燃烧发动机，一级 9 台、二级真空版。", href: "https://rocketlabcorp.com/launch/neutron" },
      { name: "Photon", status: "运营中", note: "可配置航天器平台，支持 LEO、月球与行星任务。", href: "https://rocketlabcorp.com/space-systems/" },
      { name: "Flatellite", status: "合同 / 开发", note: "面向美国太空军 AMTI 的扁平化星座平台。", href: "https://investors.rocketlabcorp.com/news-releases/news-release-details/rocket-lab-awarded-397-million-contract-build-and-launch" },
      { name: "GHOST", status: "公布 / 开发", note: "全球可部署发射场，支持响应式亚轨道与轨道发射。", href: "https://rocketlabcorp.com/updates/rocket-lab-unveils-ghost-deployable-launch-system-to-enable-responsive-space-missions-worldwide" },
    ],
    stack: [
      { area: "Electron 推进", detail: "Rutherford 是世界首款 3D 打印、电动泵驱动轨道级发动机；一级 9 台，二级 1 台真空版。", evidence: "官方" },
      { area: "Neutron 推进", detail: "Archimedes 为液氧/甲烷富氧分级燃烧，可复用一级 9 台，二级真空版；2026 完成首次热试。", evidence: "官方 / 公开报道" },
      { area: "结构", detail: "Electron 与 Neutron 大量使用碳纤维复合材料；Neutron 前穹顶制造问题导致 2026 延期。", evidence: "官方 / 公开报道" },
      { area: "航天器", detail: "Photon 采用 Rocket Lab 自研星敏感器、推进、软件与组件，体现纵向整合。", evidence: "官方" },
      { area: "通信与载荷", detail: "Mynaric 激光通信终端 + GEOST EO/IR 载荷，把业务从发射扩展到星座与传感器。", evidence: "官方 / 投资者材料" },
    ],
    research: [
      { title: "可复用中型运载", detail: "Neutron 的复用、碳纤维结构与 Archimedes 发动机是公司下一阶段的核心。" },
      { title: "响应式发射", detail: "GHOST 把发射场集装箱化，目标在 24 小时内从 call-up 到发射。" },
      { title: "激光通信", detail: "Mynaric 终端面向低轨星座的高带宽、低延迟数据链路。" },
      { title: "国家安全星座", detail: "Flatellite 与 EO/IR 载荷把公司推向 prime contractor 角色。" },
    ],
    openProjects: [
      { name: "Electron", note: "小运载与 Rutherford 发动机。", href: "https://rocketlabcorp.com/launch/electron" },
      { name: "Neutron", note: "可复用中型运载与 Archimedes。", href: "https://rocketlabcorp.com/launch/neutron" },
      { name: "Photon", note: "航天器平台与任务集成。", href: "https://rocketlabcorp.com/space-systems/" },
      { name: "100th Electron", note: "第 100 次发射官方页面。", href: "https://rocketlabcorp.com/missions/launches/iqps-the-mountain-god-rises/" },
      { name: "Flatellite 合同", note: "美国太空军 3.97 亿美元合同。", href: "https://investors.rocketlabcorp.com/news-releases/news-release-details/rocket-lab-awarded-397-million-contract-build-and-launch" },
    ],
    sources: [
      { label: "Rocket Lab Neutron", href: "https://rocketlabcorp.com/launch/neutron" },
      { label: "Rocket Lab Electron", href: "https://rocketlabcorp.com/launch/electron" },
      { label: "100th Electron", href: "https://rocketlabcorp.com/updates/rocket-lab-hits-100-electron-launches-fastest-commercial-rocket-to-reach-the-milestone/" },
      { label: "Mynaric 收购完成", href: "https://investors.rocketlabcorp.com/news-releases/news-release-details/rocket-lab-completes-mynaric-acquisition-adding-laser-optical" },
      { label: "Flatellite 合同", href: "https://investors.rocketlabcorp.com/news-releases/news-release-details/rocket-lab-awarded-397-million-contract-build-and-launch" },
      { label: "GHOST 公布", href: "https://rocketlabcorp.com/updates/rocket-lab-unveils-ghost-deployable-launch-system-to-enable-responsive-space-missions-worldwide" },
    ],
    boundaries:
      "飞控软件、发动机内部设计与生产良率未公开；本页采用公司官网、投资者公告与主流航天媒体报道，Neutron 日期仍可能变化。",
    learn: [
      { label: "阶段 04 · 嵌入式飞控", href: "/roadmap/#embedded" },
      { label: "阶段 02 · 控制理论", href: "/roadmap/#control" },
      { label: "项目 09 · STM32 最小飞控", href: "/projects/#mcu-fc" },
    ],
    compare: {
      launch: "Electron / Neutron（2027）",
      human: "无载人飞船",
      signature: "Electron 100 次 + 端到端航天系统",
      openness: "上市公司披露，软件不公开",
    },
  },
  {
    slug: "lockheed-martin",
    name: "Lockheed Martin",
    nameZh: "洛克希德·马丁",
    short: "Lockheed",
    kind: "商业公司",
    country: "美国",
    founded: "1995",
    hq: "Bethesda, Maryland",
    accent: "violet",
    tagline: "Orion、GPS 与导弹预警",
    summary:
      "以 Orion 载人深空飞船、GPS III/IIIF、Next-Gen OPIR 导弹预警与软件定义卫星为核心的防务/民用航天主承包商。2026 年 Orion 完成 Artemis II 首次载人绕月，GPS 与 OPIR 继续交付，同时推进月面裂变电源与 CLPS 2。",
    focus: ["载人深空", "导航卫星", "导弹预警", "软件定义卫星", "月面能源"],
    stats: [
      { value: "1995", label: "成立", note: "美国 · Bethesda" },
      { value: "4", label: "Orion 乘员", note: "Artemis II" },
      { value: "18", label: "SDA Tranche 2", note: "Tracking Layer 卫星" },
      { value: "5–10 kW", label: "月面裂变电源", note: "Fission Surface Power" },
    ],
    snapshot: [
      { date: "2026-01-28", title: "GPS III SV09 入轨", detail: "新一代 GPS III 卫星继续补强星座，具备更强抗干扰能力。" },
      { date: "2026-04-01/10", title: "Orion 完成 Artemis II", detail: "Lockheed 建造的 Orion 载 4 名宇航员绕月飞行约 10 天，飞行 694,481 英里后溅落太平洋。" },
      { date: "2026-04-21", title: "GPS III SV10 入轨", detail: "GPS III 系列继续交付，GPS IIIF 进入生产阶段。" },
      { date: "2026", title: "Next-Gen OPIR 推进", detail: "首颗 GEO Block 0 卫星完成系统级测试，面向下一代导弹预警。" },
      { date: "2026", title: "CLPS 2 入选", detail: "Lockheed Martin Space 入选 NASA 新一代月面货物交付合同池。" },
      { date: "2026", title: "月面裂变电源", detail: "5–10 kW 级紧凑裂变反应堆方案，面向月夜与永久阴影区持续供电。" },
    ],
    programs: [
      { name: "Orion", status: "运营 / Artemis", note: "NASA 载人深空飞船主承包商；Artemis II 已完成首次载人绕月。", href: "https://www.lockheedmartin.com/en-us/products/orion.html" },
      { name: "GPS III / IIIF", status: "生产 / 运营", note: "GPS III 卫星与后续 GPS IIIF，强调抗干扰与精度。", href: "https://www.lockheedmartin.com/en-us/products/gps.html" },
      { name: "Next-Gen OPIR", status: "开发中", note: "下一代天基红外导弹预警，GEO 与极地构型。", href: "https://www.lockheedmartin.com/en-us/capabilities/space.html" },
      { name: "SDA Tranche 2", status: "开发中", note: "18 颗 Tracking Layer 卫星，搭载 SmartSat 软件架构。", href: "https://news.lockheedmartin.com/2024-01-11-Lockheed-Martin-Awarded-Contract-for-18-SDA-Tranche-2-Tracking-Layer-Satellites" },
      { name: "SmartSat", status: "运营 / 开发", note: "软件定义卫星架构，可在轨加载任务应用。", href: "https://www.lockheedmartin.com/en-us/capabilities/digital-transformation/software-factory.html" },
      { name: "LM 400", status: "运营中", note: "中型多任务卫星平台，覆盖 LEO/MEO/GEO。", href: "https://www.lockheedmartin.com/en-us/capabilities/space.html" },
      { name: "Fission Surface Power", status: "开发中", note: "月面 5–10 kW 级裂变电源，面向月夜与阴影区。", href: "https://www.lockheedmartin.com/en-us/news/features/2026/fission-surface-power-endless-power-in-the-lunar-night.html" },
    ],
    stack: [
      { area: "Orion 航电", detail: "三余度数据网络；关键系统使用 Green Hills INTEGRITY-178 RTOS，强调确定性与隔离。", evidence: "官方 / 供应商" },
      { area: "软件定义卫星", detail: "SmartSat 把卫星总线与载荷软件应用化，支持在轨更新与任务重构。", evidence: "官方" },
      { area: "数字工程", detail: "软件工厂、数字线程与模型化工程，覆盖设计、测试与任务运营。", evidence: "官方" },
      { area: "月面能源", detail: "紧凑裂变反应堆 + 模块化电网，目标支撑月面栖息地与巡视器充电。", evidence: "官方" },
      { area: "防务载荷", detail: "OPIR、SDA、GPS 等项目的具体算法、抗辐射与加密细节不公开。", evidence: "未公开" },
    ],
    research: [
      { title: "载人深空", detail: "Orion 的生命保障、热防护、深空通信与长期可靠性。" },
      { title: " resilient GPS", detail: "GPS IIIF 的数字化导航载荷、区域军事保护与抗干扰。" },
      { title: "导弹预警与跟踪", detail: "Next-Gen OPIR 与 SDA Tracking Layer 的高超声速目标探测。" },
      { title: "月面基础设施", detail: "裂变电源、月面栖息地方案与水基月球架构。" },
      { title: "高超声速与再入", detail: "高超声速试验、热防护与精确导航；具体项目多为受限信息。" },
      { title: "软件定义空间", detail: "SmartSat 式在轨应用部署与多任务快速重构。" },
    ],
    openProjects: [
      { name: "Orion", note: "NASA 载人深空飞船。", href: "https://www.lockheedmartin.com/en-us/products/orion.html" },
      { name: "GPS", note: "GPS III / IIIF 卫星。", href: "https://www.lockheedmartin.com/en-us/products/gps.html" },
      { name: "Space", note: "Lockheed 航天能力总览。", href: "https://www.lockheedmartin.com/en-us/capabilities/space.html" },
      { name: "SmartSat", note: "软件定义卫星与在轨应用。", href: "https://www.lockheedmartin.com/en-us/capabilities/digital-transformation/software-factory.html" },
      { name: "Fission Surface Power", note: "月面裂变电源。", href: "https://www.lockheedmartin.com/en-us/news/features/2026/fission-surface-power-endless-power-in-the-lunar-night.html" },
    ],
    sources: [
      { label: "Lockheed Orion", href: "https://www.lockheedmartin.com/en-us/products/orion.html" },
      { label: "Artemis II 溅落", href: "https://news.lockheedmartin.com/2026-04-10-Splashdown-Lockheed-Martin-Built-Orion-Spacecraft-Safely-Returns-Astronauts-to-Earth,-Completing-NASAs-Artemis-II-Mission" },
      { label: "Lockheed Space", href: "https://www.lockheedmartin.com/en-us/capabilities/space.html" },
      { label: "GPS", href: "https://www.lockheedmartin.com/en-us/products/gps.html" },
      { label: "SmartSat / Software Factory", href: "https://www.lockheedmartin.com/en-us/capabilities/digital-transformation/software-factory.html" },
      { label: "Fission Surface Power", href: "https://www.lockheedmartin.com/en-us/news/features/2026/fission-surface-power-endless-power-in-the-lunar-night.html" },
      { label: "Green Hills Orion RTOS", href: "https://ghs.com/news/20260423_int-178_orion_lockheed.html" },
    ],
    boundaries:
      "国防项目的载荷、算法、抗辐射与加密细节通常不公开；本页只使用公司新闻稿、NASA 资料与供应商公开信息，不推断未披露能力。",
    learn: [
      { label: "阶段 05 · 系统验证与安全", href: "/roadmap/#systems" },
      { label: "工程核心 · 太空飞船", href: "/engineering/spacecraft/" },
      { label: "知识域 · 嵌入式与实时", href: "/fundamentals/#embedded" },
      { label: "C/C++ 工程 · 容错与 HIL", href: "/flight-software/#verification" },
    ],
    compare: {
      launch: "Orion（SLS 发射）· ULA 合资",
      human: "Orion",
      signature: "Artemis II + GPS/OPIR",
      openness: "国防项目受限，民用项目公开",
    },
  },
  {
    slug: "boeing",
    name: "Boeing",
    nameZh: "波音",
    short: "Boeing",
    kind: "商业公司",
    country: "美国",
    founded: "1916",
    hq: "Arlington, Virginia",
    accent: "blue",
    tagline: "SLS、Starliner 与 702X",
    summary:
      "以 SLS 核心级、Starliner 载人飞船、X-37B 可复用太空飞机与 702X 软件定义卫星平台为核心的航天主承包商。2026 年 SLS 核心级支撑 Artemis II，但 Starliner 仍未取得载人认证，NASA OIG 建议延后付款；卫星业务则完成 O3b mPOWER 星座交付。",
    focus: ["重型登月火箭", "商业载人", "可复用太空飞机", "软件定义卫星", "小卫星星座"],
    stats: [
      { value: "1916", label: "成立", note: "美国 · Arlington" },
      { value: "26", label: "2026 卫星交付", note: "公司目标" },
      { value: "13", label: "O3b mPOWER", note: "702X 平台" },
      { value: "4", label: "Starliner 乘员", note: "设计容量" },
    ],
    snapshot: [
      { date: "2026-04-01", title: "SLS 核心级支撑 Artemis II", detail: "Boeing 建造的 65 m 核心级（液氧/液氢 + 4 台 RS-25）完成首次载人绕月发射。" },
      { date: "2026-06", title: "NASA OIG 报告", detail: "Starliner 仍未取得载人认证；OIG 建议在认证完成前暂缓部分 Starliner-3 付款。" },
      { date: "2026-09-02", title: "O3b mPOWER 完成交付", detail: "最后 3 颗 702X 卫星交付 SES，13 颗星座建成，软件定义载荷支持动态带宽分配。" },
      { date: "2026-09", title: "Starliner 合同调整", detail: "NASA 与 Boeing 调整合同，Starliner-1 改为不载人货运，目标 2026-12/2027-01；Starliner-2 载人任务后续安排。" },
      { date: "2026", title: "26 颗卫星交付目标", detail: "Boeing / Millennium 扩大产能，面向 SDA、WGS、ESS 与商业星座。" },
      { date: "2026", title: "X-37B 继续运营", detail: "Boeing 建造的可复用太空飞机继续执行长周期在轨实验。" },
    ],
    programs: [
      { name: "SLS", status: "运营 / Artemis", note: "Boeing 负责核心级；Artemis II 已完成首次载人绕月。", href: "https://www.boeing.com/space/space-launch-system" },
      { name: "Starliner", status: "认证 / 开发", note: "CST-100 载人飞船；Starliner-1 改为不载人货运，认证仍在进行。", href: "https://www.boeing.com/space/starliner" },
      { name: "X-37B", status: "运营中", note: "可复用无人太空飞机，执行长周期在轨实验。", href: "https://www.boeing.com/space" },
      { name: "702X", status: "运营中", note: "软件定义卫星平台；O3b mPOWER 13 颗星座完成交付。", href: "https://www.boeing.com/space/satellites" },
      { name: "WGS-11/12", status: "生产", note: "宽带全球卫星通信，面向美军高吞吐通信。", href: "https://www.boeing.com/space/satellites" },
      { name: "ESS", status: "开发中", note: "Evolved Strategic SATCOM，战略通信与抗干扰。", href: "https://www.boeing.com/space/satellites" },
      { name: "Millennium Space", status: "运营中", note: "小卫星星座与导弹预警/跟踪，2026 年扩充产能。", href: "https://www.millennium-space.com/" },
    ],
    stack: [
      { area: "SLS 核心级", detail: "65 m 级液氢/液氧贮箱、4 台 RS-25、两枚五段固体助推器；Boeing 负责核心级。", evidence: "官方" },
      { area: "Starliner", detail: "CST-100 载人飞船，4 人级；推进、对接与生命保障系统为自研。", evidence: "官方" },
      { area: "X-37B", detail: "可复用无人太空飞机，长周期在轨、自主再入与水平着陆。", evidence: "官方" },
      { area: "702X", detail: "全软件定义载荷，支持动态波束、带宽与功率分配；O3b mPOWER 为旗舰应用。", evidence: "官方" },
      { area: "数字工程", detail: "模型化工程、数字线程与增材制造用于 SLS/Starliner/卫星生产；具体工具链未公开。", evidence: "官方 / 未公开" },
    ],
    research: [
      { title: "重型登月火箭", detail: "SLS Block 1B / Exploration Upper Stage 与后续深空任务。" },
      { title: "商业载人认证", detail: "Starliner 的推进、氦气系统、软件与乘员安全认证。" },
      { title: "可复用太空飞机", detail: "X-37B 的长周期在轨、热防护与自主返回。" },
      { title: "软件定义卫星", detail: "702X 的动态资源分配、数字载荷与多轨道覆盖。" },
      { title: "小卫星星座", detail: "Millennium 的快速生产、导弹预警/跟踪与商业星座。" },
    ],
    openProjects: [
      { name: "SLS", note: "Boeing 的 SLS 核心级页面。", href: "https://www.boeing.com/space/space-launch-system" },
      { name: "Starliner", note: "CST-100 与任务更新。", href: "https://www.boeing.com/space/starliner" },
      { name: "Satellites", note: "702X、WGS、ESS 与 Millennium。", href: "https://www.boeing.com/space/satellites" },
      { name: "NASA OIG 报告", note: "Commercial Crew 管理与 Starliner 认证问题。", href: "https://oig.nasa.gov/wp-content/uploads/2026/06/final-report-ig-26-011-nasas-management-of-its-commercial-crew-program.pdf" },
    ],
    sources: [
      { label: "Boeing SLS", href: "https://www.boeing.com/space/space-launch-system" },
      { label: "Boeing Starliner", href: "https://www.boeing.com/space/starliner" },
      { label: "Boeing Satellites", href: "https://www.boeing.com/space/satellites" },
      { label: "O3b mPOWER 交付", href: "https://boeing.mediaroom.com/news-releases-statements?item=131711" },
      { label: "NASA OIG Commercial Crew", href: "https://oig.nasa.gov/wp-content/uploads/2026/06/final-report-ig-26-011-nasas-management-of-its-commercial-crew-program.pdf" },
      { label: "Boeing Artemis II", href: "https://boeing.mediaroom.com/2026-04-01-Boeing-built-Space-Launch-System-Core-Stage-Powers-First-Crewed-Artemis-Mission-around-the-Moon" },
    ],
    boundaries:
      "Starliner 认证细节、SLS 生产节拍与国防载荷参数未完全公开；NASA OIG 报告提供了少见的独立审查视角。",
    learn: [
      { label: "阶段 05 · 验证与安全", href: "/roadmap/#systems" },
      { label: "工程核心 · 太空飞船", href: "/engineering/spacecraft/" },
      { label: "阶段 04 · 嵌入式飞控", href: "/roadmap/#embedded" },
      { label: "C/C++ 工程 · 容错与 HIL", href: "/flight-software/#verification" },
    ],
    compare: {
      launch: "SLS（核心级）· ULA 合资",
      human: "Starliner（认证中）",
      signature: "Artemis II + 702X 星座",
      openness: "上市公司 + NASA OIG，细节受限",
    },
  },
  {
    slug: "nasa",
    name: "NASA",
    nameZh: "美国国家航空航天局",
    short: "NASA",
    kind: "政府机构",
    country: "美国",
    founded: "1958",
    hq: "Washington, D.C.",
    accent: "red",
    tagline: "Artemis、Moon Base 与开放飞控",
    summary:
      "以 Artemis 载人探月、HLS、CLPS 月面货物、Roman 太空望远镜与开放飞控软件为核心的民用航天机构。2026 年 Artemis II 完成首次载人绕月；Ignition 战略把重点从 Gateway 转向月面，Artemis III 改为 2027 年近地轨道演示，Artemis IV 目标 2028 年载人着陆。",
    focus: ["载人探月", "商业月面货物", "深空科学", "开放飞控软件", "火星样本返回"],
    stats: [
      { value: "1958", label: "成立", note: "美国 · Washington, D.C." },
      { value: "2026-04", label: "Artemis II", note: "首次载人绕月" },
      { value: "2027", label: "Artemis III", note: "近地轨道演示" },
      { value: "2028", label: "Artemis IV", note: "计划载人着陆" },
    ],
    snapshot: [
      { date: "2026-03-24", title: "Ignition 战略", detail: "NASA 公布新战略：加速 Artemis、转向月面基础设施，并暂停 Gateway 当前形态。" },
      { date: "2026-04-01/10", title: "Artemis II 成功", detail: "4 名宇航员乘 Orion 绕月飞行约 10 天，飞行 694,481 英里后溅落太平洋。" },
      { date: "2026-08-30", title: "Roman 太空望远镜发射", detail: "Falcon Heavy 发射 Nancy Grace Roman Space Telescope，前往 L2；科学运行预计 2027 年初。" },
      { date: "2026-10-23", title: "Artemis III 改为 LEO", detail: "Artemis III 改为 2027 年近地轨道演示，测试 Orion 与 SpaceX / Blue Origin 着陆器试验版对接。" },
      { date: "2026-11", title: "Artemis IV 目标 2028", detail: "Artemis IV 计划 2028 年执行首次载人月面着陆，着陆器在 SpaceX 与 Blue Origin 之间确定。" },
      { date: "2026", title: "CLPS 2 与 Moon Base", detail: "NASA 推进 CLPS 2 与月面基地，计划到 2028 年实施多次商业月面着陆。" },
      { date: "2026", title: "MSR 重构", detail: "火星样本返回转向 Perseverance Sample Retrieval Architecture，评估商业着陆方案，预算与架构仍在调整。" },
    ],
    programs: [
      { name: "Artemis", status: "运营 / 加速", note: "Artemis II 完成；III 改为 2027 LEO；IV 目标 2028 着陆。", href: "https://www.nasa.gov/humans-in-space/artemis/" },
      { name: "SLS", status: "运营中", note: "Block 1 用于 Artemis I–III；95 t LEO / 27 t TLI。", href: "https://www.nasa.gov/humans-in-space/space-launch-system/" },
      { name: "Orion", status: "运营中", note: "Lockheed 建造的载人深空飞船；Artemis II 已验证载人绕月。", href: "https://www.nasa.gov/reference/orion-spacecraft/" },
      { name: "HLS", status: "开发中", note: "SpaceX Starship HLS 与 Blue Origin Blue Moon MK2 竞争 Artemis 着陆。", href: "https://www.nasa.gov/humans-in-space/human-landing-system/" },
      { name: "CLPS / Moon Base", status: "运营 / 扩展", note: "商业月面货物交付与月面基地；CLPS 2 扩大供应商池。", href: "https://www.nasa.gov/commercial-lunar-payload-services/" },
      { name: "Roman", status: "发射 / 调试", note: "2026-08-30 发射，前往 L2；预计 2027 年初开始科学运行。", href: "https://science.nasa.gov/mission/roman-space-telescope/" },
      { name: "Mars Sample Return", status: "重构", note: "PSRA 方案评估商业着陆与样本返回架构。", href: "https://science.nasa.gov/mission/mars-sample-return/" },
      { name: "F´ / cFS / Open MCT", status: "开源", note: "飞行软件框架、核心飞行系统与任务控制可视化。", href: "https://github.com/nasa/fprime" },
    ],
    stack: [
      { area: "SLS / Orion", detail: "SLS Block 1：4 台 RS-25 + 两枚五段固体助推器；Orion 使用三余度数据网络与 Green Hills INTEGRITY-178。", evidence: "官方 / 供应商" },
      { area: "开放飞控", detail: "F´（JPL）组件化飞行软件、cFS 核心飞行系统、Open MCT 任务控制可视化，均可公开获取。", evidence: "开源仓库" },
      { area: "月面体系", detail: "CLPS 货物着陆、HLS 载人着陆、LTV 与月面通信/能源，构成 Moon Base 的三阶段架构。", evidence: "官方" },
      { area: "科学与计算", detail: "Roman、JWST、火星探测与高性能计算/仿真支撑任务设计与数据科学。", evidence: "官方" },
      { area: "标准与保证", detail: "NASA-STD-8739.8、软件保证与安全流程；具体项目仍受 ITAR/出口控制。", evidence: "官方" },
    ],
    research: [
      { title: "月面持续存在", detail: "Artemis、CLPS、LTV、月面能源与通信，目标从“到达”转向“停留”。" },
      { title: "载人深空", detail: "Orion 生命保障、辐射防护、深空通信与长期可靠性。" },
      { title: "火星样本返回", detail: "PSRA 架构、商业着陆与样本链路的成本/风险权衡。" },
      { title: "天体物理", detail: "Roman 的暗能量、系外行星与红外巡天；JWST 继续运行。" },
      { title: "开放飞控与数字工程", detail: "F´、cFS、Open MCT、NOS3 与基于模型的工程实践。" },
    ],
    openProjects: [
      { name: "F´", note: "JPL 组件化飞行软件框架。", href: "https://github.com/nasa/fprime" },
      { name: "cFS", note: "NASA 核心飞行系统。", href: "https://github.com/nasa/cFS" },
      { name: "Open MCT", note: "Web 任务控制可视化。", href: "https://nasa.github.io/openmct/" },
      { name: "NASA Open Source", note: "NASA 开源软件目录。", href: "https://www.nasa.gov/open-source-software/" },
      { name: "Artemis II", note: "官方任务页。", href: "https://www.nasa.gov/mission/artemis-ii/" },
      { name: "Roman", note: "官方任务页与发射更新。", href: "https://science.nasa.gov/mission/roman-space-telescope/" },
    ],
    sources: [
      { label: "Artemis II", href: "https://www.nasa.gov/mission/artemis-ii/" },
      { label: "加速 Artemis 计划", href: "https://www.nasa.gov/missions/artemis/nasa-shares-plans-to-accelerate-artemis-return-to-moon" },
      { label: "Ignition 战略 PDF", href: "https://www.nasa.gov/wp-content/uploads/2026/03/ignition.pdf" },
      { label: "Roman", href: "https://science.nasa.gov/mission/roman-space-telescope/" },
      { label: "Mars Sample Return", href: "https://science.nasa.gov/mission/mars-sample-return/" },
      { label: "F´", href: "https://github.com/nasa/fprime" },
      { label: "cFS", href: "https://github.com/nasa/cFS" },
      { label: "Open MCT", href: "https://nasa.github.io/openmct/" },
    ],
    boundaries:
      "NASA 大量数据与软件公开，但硬件设计、ITAR 敏感技术与部分任务数据受限；预算与任务日期会随国会与政府决策变化。",
    learn: [
      { label: "C/C++ 工程 · F´ / cFS", href: "/flight-software/#fsw" },
      { label: "阶段 05 · 系统验证", href: "/roadmap/#systems" },
      { label: "工程核心 · 轨道力学", href: "/engineering/orbits/" },
      { label: "知识域 · 系统工程", href: "/fundamentals/#systems" },
    ],
    compare: {
      launch: "SLS",
      human: "Orion / HLS",
      signature: "Artemis II + Roman + 开放飞控",
      openness: "开源软件与任务数据，硬件受限",
    },
  },
  {
    slug: "esa",
    name: "ESA",
    nameZh: "欧洲空间局",
    short: "ESA",
    kind: "政府机构",
    country: "欧洲",
    founded: "1975",
    hq: "Paris, France",
    accent: "green",
    tagline: "Ariane 6、Space Rider 与科学任务",
    summary:
      "以 Ariane 6、Vega-C、Space Rider 可复用飞船、Orion ESM 与科学任务为核心的欧洲航天机构。2026 年 Ariane 6 四助推器构型首飞并发射 36 颗 Amazon Leo；CM25 预算 €22.1B；Space Rider 目标 2027 首飞，ExoMars 2028，PLATO 2027。",
    focus: ["自主进入空间", "可复用运输", "地球观测", "导航", "深空科学"],
    stats: [
      { value: "1975", label: "成立", note: "欧洲 · Paris" },
      { value: "€22.1B", label: "CM25 预算", note: "2025-11 批准" },
      { value: "21.6 t", label: "Ariane 6 LEO", note: "四助推器构型" },
      { value: "2027", label: "Space Rider 首飞", note: "计划" },
    ],
    snapshot: [
      { date: "2025-11", title: "CM25 预算", detail: "ESA 成员国在不来梅批准 €22.1B 预算，重点支持发射、科学、地球观测与商业化。" },
      { date: "2026-06-17", title: "Ariane 6 四助推器首飞", detail: "VA269 发射 36 颗 Amazon Leo 卫星，Ariane 6 四助推器构型 LEO 运力约 21.6 t。" },
      { date: "2026-08", title: "European Launcher Challenge", detail: "ESA 向 Isar、RFA、PLD Space 授予合计 €543.6M 合同，支持小型/中型运载与可复用技术。" },
      { date: "2026-11", title: "Hera 抵达 Didymos", detail: "Hera 抵达双小行星系统，开始 Dimorphos 详细表征。" },
      { date: "2027", title: "PLATO 发射", detail: "系外行星猎手 PLATO 计划 2027 年由 Ariane 6 发射，前往 L2。" },
      { date: "2027", title: "Space Rider 首飞", detail: "可复用无人飞船计划 2027 年由 Vega-C 发射；2026 年全尺寸 drop test 出现降落伞分离故障。" },
      { date: "2028", title: "ExoMars Rosalind Franklin", detail: "欧洲火星车计划 2028 年 9/12 月窗口发射，钻探地下 2 m 寻找生命迹象。" },
    ],
    programs: [
      { name: "Ariane 6", status: "运营中", note: "重型一次性运载；四助推器构型 LEO 约 21.6 t；2026 年发射 36 颗 Amazon Leo。", href: "https://www.esa.int/Enabling_Support/Space_Transportation/Launch_vehicles/Ariane_6_overview" },
      { name: "Vega-C", status: "运营中", note: "小型运载，承担 Space Rider 与科学任务。", href: "https://www.esa.int/Enabling_Support/Space_Transportation/Vega/Vega-C" },
      { name: "Space Rider", status: "开发 / 首飞 2027", note: "可复用无人太空实验室，Vega-C 发射，滑翔/降落伞回收。", href: "https://www.esa.int/Enabling_Support/Space_Transportation/Space_Rider" },
      { name: "ESM", status: "运营中", note: "Orion 欧洲服务舱，提供推进、电力、水、氧与热控。", href: "https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Orion" },
      { name: "ExoMars", status: "开发 / 2028", note: "Rosalind Franklin 火星车 + 欧洲着陆平台，钻探 2 m。", href: "https://www.esa.int/missions/exomars" },
      { name: "Hera", status: "运营中", note: "小行星防御任务，2026-11 抵达 Didymos。", href: "https://www.esa.int/missions/about-us/directorates/operations/space-safety/hera" },
      { name: "PLATO", status: "开发 / 2027", note: "系外行星探测，26 台相机，L2 轨道。", href: "https://www.esa.int/Science_Exploration/Space_Science/Plato" },
      { name: "Euclid", status: "运营中", note: "暗能量与暗物质巡天，2023 年发射。", href: "https://www.esa.int/Science_Exploration/Space_Science/Euclid" },
      { name: "LISA", status: "开发中", note: "空间引力波天文台，计划 2035 年发射。", href: "https://www.esa.int/Science_Exploration/Space_Science/LISA" },
    ],
    stack: [
      { area: "Ariane 6", detail: "液氧/液氢芯级 + 固体助推器；四助推器构型提升 LEO 运力到约 21.6 t。", evidence: "官方" },
      { area: "Space Rider", detail: "可复用无人飞船，Vega-C 发射，滑翔与降落伞回收；2026 年 drop test 暴露降落伞分离问题。", evidence: "官方 / 公开报道" },
      { area: "ESM", detail: "Orion 服务舱由欧洲工业团队建造，提供推进、电力、热控与生命保障资源。", evidence: "官方" },
      { area: "标准与地面", detail: "ECSS 标准体系、EGS-CC 地面系统共同核心、SAVOIR 航电参考架构。", evidence: "官方" },
      { area: "工业模式", detail: "多国工业 consortium、ArianeGroup / Arianespace / Avio 等分工；软件与任务细节按合同公开。", evidence: "官方 / 未公开" },
    ],
    research: [
      { title: "自主进入空间", detail: "Ariane 6 / Vega-C 的运营与成本下降，减少对非欧洲发射的依赖。" },
      { title: "可复用运输", detail: "Space Rider 与 European Launcher Challenge 支持可复用/可回收技术。" },
      { title: "火星生命探测", detail: "ExoMars 2 m 钻探、地下样本与着陆平台。" },
      { title: "行星防御", detail: "Hera 对 Dimorphos 的详细表征，评估动能撞击效果。" },
      { title: "系外行星与引力波", detail: "PLATO、Euclid、LISA 构成下一代空间科学组合。" },
      { title: "地球观测与导航", detail: "Copernicus 与 Galileo 提供气候、环境与定位基础设施。" },
    ],
    openProjects: [
      { name: "Ariane 6", note: "官方火箭页面与任务更新。", href: "https://www.esa.int/Enabling_Support/Space_Transportation/Launch_vehicles/Ariane_6_overview" },
      { name: "Space Rider", note: "可复用无人飞船。", href: "https://www.esa.int/Enabling_Support/Space_Transportation/Space_Rider" },
      { name: "ExoMars", note: "Rosalind Franklin 火星车。", href: "https://www.esa.int/missions/exomars" },
      { name: "PLATO", note: "系外行星任务。", href: "https://www.esa.int/Science_Exploration/Space_Science/Plato" },
      { name: "European Launcher Challenge", note: "新一代欧洲运载竞争。", href: "https://www.esa.int/Enabling_Support/Space_Transportation/European_Launcher_Challenge" },
      { name: "Hera", note: "小行星防御任务。", href: "https://www.esa.int/missions/about-us/directorates/operations/space-safety/hera" },
    ],
    sources: [
      { label: "CM25 预算", href: "https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Shaping_the_Future/CM25_A_historic_step_forward_for_Europe_s_space_technology_leadership" },
      { label: "Ariane 6 四助推器", href: "https://www.esa.int/Enabling_Support/Space_Transportation/Ariane/More_power_first_Ariane_6_with_four_boosters_lifts_off" },
      { label: "European Launcher Challenge", href: "https://www.esa.int/Enabling_Support/Space_Transportation/European_Launcher_Challenge" },
      { label: "Space Rider", href: "https://www.esa.int/Enabling_Support/Space_Transportation/Space_Rider" },
      { label: "ExoMars", href: "https://www.esa.int/missions/exomars" },
      { label: "PLATO", href: "https://www.esa.int/Science_Exploration/Space_Science/Plato" },
      { label: "Hera", href: "https://www.esa.int/missions/about-us/directorates/operations/space-safety/hera" },
    ],
    boundaries:
      "ESA 项目由成员国与工业合同共同决定，部分预算、进度与技术细节只在官方文件中间接披露；发射日期可能随测试与预算调整。",
    learn: [
      { label: "阶段 05 · 系统验证", href: "/roadmap/#systems" },
      { label: "C/C++ 工程 · CCSDS", href: "/flight-software/#comms" },
      { label: "工程核心 · 轨道力学", href: "/engineering/orbits/" },
      { label: "知识域 · 系统工程", href: "/fundamentals/#systems" },
    ],
    compare: {
      launch: "Ariane 6 / Vega-C",
      human: "Orion ESM",
      signature: "Ariane 6 四助推器 + 科学任务",
      openness: "标准与任务公开，合同细节受限",
    },
  },
];

export const INDUSTRY_TIMELINE = [
  { date: "2026-03-24", org: "NASA", title: "Ignition 战略", detail: "加速 Artemis，暂停 Gateway 当前形态，转向月面基地。" },
  { date: "2026-04-01", org: "NASA / Lockheed / Boeing", title: "Artemis II 发射", detail: "Orion 载 4 人绕月，SLS 核心级与 ESM 参与。" },
  { date: "2026-04-19", org: "Blue Origin", title: "New Glenn NG-3", detail: "首次复用 New Glenn 助推器。" },
  { date: "2026-05-28", org: "Blue Origin", title: "NG-4 静态点火爆炸", detail: "BE-4 主氧阀异常，LC-36 受损，复飞推迟。" },
  { date: "2026-06-17", org: "ESA", title: "Ariane 6 四助推器首飞", detail: "发射 36 颗 Amazon Leo，LEO 运力约 21.6 t。" },
  { date: "2026-08-30", org: "NASA", title: "Roman 发射", detail: "Falcon Heavy 送往 L2，科学运行预计 2027 年初。" },
  { date: "2026-09-28", org: "SpaceX", title: "Starship 首次入轨", detail: "Flight 14 部署 26 颗 Starlink V3。" },
  { date: "2026-10-15", org: "Rocket Lab", title: "Neutron 推迟 2027", detail: "碳纤维前穹顶问题，Archimedes 完成热试。" },
  { date: "2026-11-12", org: "Blue Origin", title: "Orbital Reef 暂停", detail: "退出 NASA 商业空间站 Phase 2，聚焦月球。" },
  { date: "2026-11-13/14", org: "SpaceX", title: "Starship 首次飞船回收", detail: "Flight 15 发射塔夹住飞船；助推器回收因制导问题放弃。" },
  { date: "2026-11-14", org: "Rocket Lab", title: "Electron 100 次", detail: "第 100 次发射 iQPS QPS-SAR-19。" },
  { date: "2026-11", org: "ESA", title: "Hera 抵达 Didymos", detail: "开始对小行星 Dimorphos 的详细表征。" },
];

export const INDUSTRY_THEMES = [
  {
    index: "01",
    title: "复用从“能落”走向“能周转”",
    body: "New Glenn 首次复用助推器、Starship 首次回收飞船，但 New Glenn 地面爆炸与 Starship 助推器回收中止说明：复用能力不等于高频运营。下一步竞争点是检查、翻修与供应链。",
  },
  {
    index: "02",
    title: "月球从轨道转向表面",
    body: "NASA Ignition 暂停 Gateway 当前形态，把预算与硬件转向月面基地；Artemis III 改为 2027 年近地轨道演示，Artemis IV 目标 2028 年着陆。HLS、CLPS 与月面能源成为主战场。",
  },
  {
    index: "03",
    title: "星座与通信成为第二增长曲线",
    body: "Starlink V3、Amazon Leo、Rocket Lab 的 Flatellite/Mynaric 与 Boeing 702X 都指向同一件事：卫星不再只是载荷，而是可动态分配的网络节点。",
  },
  {
    index: "04",
    title: "国防需求重塑商业航天",
    body: "SDA、Next-Gen OPIR、GPS IIIF、WGS/ESS 与 Flatellite 把商业公司推向国家安全 prime contractor；软件定义、抗干扰与快速迭代成为硬指标。",
  },
  {
    index: "05",
    title: "认证与供应链是隐形瓶颈",
    body: "Starliner 仍未取得载人认证、Neutron 因碳纤维穹顶延期、New Glenn 因一个氧阀爆炸——2026 年最昂贵的教训都来自“非算法”环节。",
  },
  {
    index: "06",
    title: "欧洲在补自主进入空间",
    body: "Ariane 6 四助推器构型与 €543.6M European Launcher Challenge 同步推进；Space Rider、ExoMars、PLATO 与 Hera 展示欧洲在可复用运输与科学任务上的长期布局。",
  },
];
