# RocketFlightControl · 火箭飞控学习路线图

一份写给工程师与自学者的中文 **GNC（Guidance, Navigation & Control）** 学习地图：从一维数值仿真、六自由度建模、控制与状态估计，到嵌入式飞控、HIL 半实物测试与探空火箭飞行验证。

**Live site:** https://lulgabc.github.io/RocketFlightControl/

## 里面有什么

- **七阶段路线图** — 数学地基 → 六自由度动力学 → 控制理论 → 导航/估计/制导 → 嵌入式飞控 → 系统验证与安全 → 进阶 GNC。每阶段含目标、核心主题、阶段产物、验收标准、资源入口与 6 个能力检查点，共 42 项；进度保存在浏览器本地。
- **知识地图** — 7 个知识域，50 条核心概念、35 条掌握标准与 21 条常见误区，用来定位“哪里其实没懂”。
- **项目阶梯** — 12 个由浅入深的实践项目，从一维积分器到 STM32 最小飞控、HIL 台架、探空火箭闭环与垂直回收制导；每个都有实施步骤、验收标准和延伸方向。
- **C/C++ 工程专线** — 飞行软件与通信两条主线、12 个模块、18 个月计划：C++20 / 无堆、PREEMPT_RT / FreeRTOS / Zephyr、F´ / cFS、Eigen / 凸优化代码生成、CCSDS / SDR / DTN、Yamcs / OpenC3 地面段，以及 53 条专用资源。
- **技术趋势与事实核查** — 逐条标注“已核实 / 部分属实 / 需修正 / 未证实”：SpaceX 的 Linux + C/C++ + Actor-Judge、Starlink 回传、Linux 6.12 PREEMPT_RT、Ferrocene、NASA HPSC、Clarabel / FATROP 等，并给出边界与来源。
- **工业前沿** — 7 家机构独立子页面：SpaceX、Blue Origin、Rocket Lab、Lockheed Martin、Boeing、NASA、ESA。每页含 2026 最新状态、主要项目、技术栈、研究方向、公开项目、来源与信息边界；总览页提供时间线与横向对比。
- **工程核心** — 5 个硬核知识页：火箭发动机、太空飞船、轨道力学、再入与热防护、结构/材料/制造。每页含第一性原理公式、工程权衡、失效模式、参考型号、开源项目与专业资源。
- **无人机实验室** — 5 条路线：PX4/ArduPilot 自主栈、Betaflight/ExpressLRS FPV、Jetson 边缘 AI、Crazyflie 蜂群、Remote ID/空域与安全。含构建步骤、失效模式、开源项目与 2026 趋势；附可运行的 **Lab 01：PX4 SITL + MAVSDK Offboard**。
- **资源库** — 49 条精选书、公开课、开源飞控、仿真工具、标准与社区入口，标注难度、语言和用途。
- **交互工具箱** — 齐奥尔科夫斯基 Δv 计算器、ISA 标准大气与动压计算器、单轴姿态 PID 阶跃响应模拟器（Canvas，本地运行）。
- **安全与学习方法** — 时间预期、每周节奏、为什么这样排序，以及推进剂、空域、许可与飞行终止的安全边界。

## 技术

- [Astro](https://astro.build/) 静态站点，无前端框架运行时
- GitHub Pages 自动部署（GitHub Actions）
- 全部交互为原生 TypeScript + Canvas，无第三方脚本、无字体/CDN 请求、无追踪
- 深色/浅色主题；支持 `prefers-reduced-motion`
- 所有页面静态生成，适合离线阅读与打印

## 本地开发

需要 Node.js **22.23.4+**（Astro 7 的要求；Node 24 推荐）。

```bash
npm install
npm run dev
```

打开 http://localhost:4321/RocketFlightControl/

```bash
npm run build      # 生成 dist/
npm run preview    # 预览构建结果
npm run check      # TypeScript / Astro 检查
```

## 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会构建并把 `dist/` 发布到 GitHub Pages。

仓库设置里将 **Pages → Build and deployment → Source** 设为 **GitHub Actions**。

Astro 配置使用：

```js
site: "https://lulgabc.github.io",
base: "/RocketFlightControl",
```

如果 fork 到其他仓库名，请同步修改 `astro.config.mjs`、`src/lib/site.ts`、`public/robots.txt`、`public/og.svg` 并重新导出 `public/og.png`。

## 内容原则

1. **按产物组织，不按教材章节。** 每个阶段必须能跑、能测、能演示。
2. **先仿真，后硬件；先一维，后六维。** 不鼓励跳级。
3. **区分事实、推测与趋势。** SpaceX 的公开信息有限；所有关键说法标注核实状态，不把“论文可行”当作“已在轨使用”。
4. **资源少而准。** 每条注明难度与用途；每阶段最多精读 2–3 个入口。
5. **安全是设计输入。** 本网站不提供推进剂配方、发动机制造或发射操作指令。

## 许可

代码与文字内容以 [MIT License](./LICENSE) 开源。第三方书籍、论文、商标与资源版权归各自权利人所有。

## 安全声明

火箭推进与飞行具有高风险。本站内容面向仿真、电子、模型火箭与在合规场地进行的探空火箭，不构成工程、法律或安全建议。发射前请确认当地法律、空域、场地、许可、保险与人员距离要求，并由有资质人员评审。
