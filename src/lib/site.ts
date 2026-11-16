export const SITE = {
  title: "RocketFlightControl",
  titleZh: "火箭飞控手册",
  tagline: "Guidance · Navigation · Control",
  description:
    "一份写给工程师与自学者的中文火箭飞控学习路线图：从数值仿真、六自由度建模、控制与状态估计，到嵌入式飞控、半实物测试与飞行验证；并附 C/C++ 飞控与通信工程专线、2026 工业前沿、工程核心知识库、无人机实验室与事实核查。",
  url: "https://lulgabc.github.io",
  base: "/RocketFlightControl",
  repo: "https://github.com/lulgabc/RocketFlightControl",
  author: "RocketFlightControl",
  nav: [
    { href: "/roadmap/", label: "学习路线", short: "路线" },
    { href: "/fundamentals/", label: "知识地图", short: "知识" },
    { href: "/projects/", label: "项目阶梯", short: "项目" },
    { href: "/flight-software/", label: "C/C++ 工程", short: "C/C++" },
    { href: "/industry/", label: "工业前沿", short: "工业" },
    { href: "/engineering/", label: "工程核心", short: "工程" },
    { href: "/drone/", label: "无人机", short: "无人机" },
    { href: "/resources/", label: "资源库", short: "资源" },
    { href: "/toolkit/", label: "工具箱", short: "工具" },
  ],
};

export const PRINCIPLES = [
  {
    index: "01",
    title: "先仿真，后硬件",
    body: "在焊第一块板之前，让飞行器在 Python 里飞一百次。仿真不是作业，是你唯一能低成本经历坠毁的地方。",
  },
  {
    index: "02",
    title: "先一维，后六维",
    body: "把姿态、高度、速度拆成单轴问题逐个打通，再合成六自由度。所有“玄学振荡”几乎都能追溯到没被单独验证的轴。",
  },
  {
    index: "03",
    title: "控制不是调参",
    body: "先有模型、执行机构带宽和噪声预算，再谈增益。没有指标的 PID 调参，只是把问题藏进另一段时间尺度。",
  },
  {
    index: "04",
    title: "每阶段必须可运行",
    body: "看完课不算学会。每个阶段的终点都是一个能跑、能测、能给别人演示的产物，否则就退回上一阶段。",
  },
  {
    index: "05",
    title: "读源码，也读事故报告",
    body: "PX4 与 ArduPilot 是活的教科书；事故报告是免费的失效模式课。两者都比 PPT 更接近真实系统。",
  },
  {
    index: "06",
    title: "安全是设计输入",
    body: "推进剂、空域、发射许可、飞行终止、人员距离——这些不是最后补的文档，而是从第一版需求就存在的约束。",
  },
];
