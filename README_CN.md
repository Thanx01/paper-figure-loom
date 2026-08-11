# Paper Figure Loom

[English](README.md) | **简体中文**

**先把框架图拆成零件，再按原位织回一张真正可编辑的 PPT。**

Paper Figure Loom 把一套原本需要在 GPT、下载目录和本地 Codex 之间来回接力的流程，收进一次 Codex 任务：先得到一张完整母图，再把母图里能独立成图的 UI、图标和插画逐一重新生成成透明素材，最后按照母图的比例、位置、层级和配色把它们拼回 PowerPoint。

你只需要提供论文或母图，最后验收结果。中间不用反复发送“继续生成”，不用手工下载素材包，也不用再把压缩包转交给另一个任务。

## 这套 Skill 严格做什么

整条工作流固定分成三步，顺序不会省略。

### 1. 先确定一张完整母图

如果你已经用 GPT 根据论文原文 DIY 好了框架图，直接把这张图交给 Skill。它会把这张图作为唯一的视觉母版，不重新设计版式。

如果你只有论文、想法或风格参考，Skill 会先读清楚必须出现的文字、模块和连接关系，再调用 Codex 内置图像生成制作三张完整候选图。缺模块的候选会被淘汰，最终只选一张作为母图。

母图决定构图、配色和视觉风格；你明确写下的文字和论文原意决定最终内容。母图里偶尔生成错的字，不会覆盖正确原文。

### 2. 把母图里的 UI 和图标逐个重生成透明单图

这一步对应你原来的指令：

> 尽可能细粒度且完整地找出图片里所有能独立抠下来的 UI、图标和插画，针对每一个重新生成单张图片，不要底色和背景。

Skill 会检查两遍母图。第一遍找主要模块、文字、连线和明显的视觉组件；第二遍专门找第一遍没解释掉的小图标、装饰、徽标、被遮挡元素和角落细节。

执行时遵守几个明确规则：

- 每个视觉上可以独立存在的 UI、图标、插画或装饰，单独建立一个素材任务；
- 每个素材都同时参考完整母图和它在母图中的局部裁剪，只重新生成目标本身；
- 素材先生成在纯色背景上，再去除背景；没有真实透明区域或没有可见主体的结果不能通过；
- 同一个图标出现三次时，会保留三个位置，但相同图标只生成一次并复用，避免制造重复文件；
- 普通文字、简单方框和箭头不做成位图，而是保留为 PowerPoint 原生对象；简单图标也可以用真实矢量形状重画；
- 不会为了少生成几张图，就把本来能分开的多个图标粗暴合并成一大块。

默认策略是“参考母图重新生成透明素材”，不是直接裁一块带背景的截图。只有你明确要求保留原始裁剪时，才允许改用直接提取。

### 3. 按母图原位拼回 PowerPoint

有了细粒度素材库之后，Skill 会把原框架图当作装配图：按标准化坐标放回每一个元素，保持画布比例、元素宽高比、相对位置、配色、遮挡层级和连线关系。

文字、面板和连接线会成为真正可选中、可修改的 PowerPoint 对象；复杂 UI 和插画会以透明 PNG 放入，并锁定纵横比。整张母图不会被铺在幻灯片上充当“高还原度捷径”。

完成后，Skill 会把 PPT 渲染成图片，与母图生成并排图、叠加图、差异图、元素框图和素材总览。只修未通过的局部；如果在修复预算内仍无法达到门槛，就返回问题报告和可继续运行的状态，而不是把半成品冒充成功。

## 怎么使用

### 用法 A：你已经有 GPT 生成的母图

把母图附在 Codex 任务里，然后发送：

```text
使用 $rebuild-paper-figures 处理附件中的原框架图。

先尽可能细粒度且完整地识别图中所有能独立成图的 UI、图标、插画和装饰；
针对每一种不同的视觉元素，参考原图重新生成一张无底色、无背景的透明单图。
然后以原框架图为唯一布局母版，用这些细粒度素材 1:1 拼回一页可编辑 PowerPoint，
保持画布比例、元素比例、相对位置、层级、连线和配色一致。
文字、方框和连线必须是原生可编辑对象。完成自动对比和局部修复后，只交付最终文件。
```

这条路线在运行记录中叫 `rebuild`，也是目前最稳定、最贴合原始工作流的用法。

### 用法 B：从论文原文开始

附上论文，可选附上风格参考，然后发送：

```text
使用 $rebuild-paper-figures，根据附件论文制作一张单页方法框架图。

先锁定论文中的准确文字、模块和连接关系，再生成三张完整母图并选出结构完整的一张。
接着逐一重新生成母图中所有可独立成图的 UI、图标、插画和装饰为透明单图，
最后按选定母图的比例、位置、层级和配色拼成可编辑 PowerPoint。
自动完成视觉对比和局部修复，中间不需要我确认，只在最后让我验收。
```

这条路线叫 `author`。它把“先用 GPT 根据 paper DIY 母图”也纳入同一次任务；选定母图以后，后两步与 `rebuild` 完全相同。

### 中断后继续

每个阶段都会原子保存。如果任务中断，继续使用同一个运行目录：

```text
使用 $rebuild-paper-figures，继续 /absolute/path/to/run-directory 中的任务。
读取 run-state.json，保留已经通过的阶段和素材，从下一项继续。
```

## 安装

把仓库添加为 Codex 插件市场：

```bash
codex plugin marketplace add Thanx01/paper-figure-loom --ref main
```

重启 Codex Desktop，打开 **Plugins（插件）**，在 **personal（个人）** 市场中安装 **Paper Figure Loom**。

也可以从本地克隆安装：

```bash
git clone https://github.com/Thanx01/paper-figure-loom.git
codex plugin marketplace add /absolute/path/to/paper-figure-loom
```

首版面向 Codex Desktop 本地模式，直接调用 Codex 内置图像生成，不需要 `OPENAI_API_KEY`，也不会自动操作网页版 ChatGPT。

## 最后会拿到什么

- `framework.pptx`：权威可编辑成品；
- `framework.svg` 与 `framework.png`：完整框架图；
- `assets/png/`：每个细粒度视觉元素的透明 PNG；
- `assets/svg/`：每个素材对应的 SVG；复杂素材的 SVG 会如实嵌入 PNG，不伪装成纯矢量；
- `assets-manifest.json`：每个素材的来源、策略、对应实例、透明度检查和可编辑级别；
- `qa/` 与 `qa-report.json`：母图对比、差异图、元素框和素材总览；
- `paper-figure-loom-delivery.zip`：完整交付包。

## “1:1”在这里是什么意思

“1:1”首先指结构、逐字文字、画布比例、元素位置、大小、层级、配色和直接重建的几何关系处于项目规定的误差内；也指拼装过程不会拉伸素材，不会漏掉图标，不会用整页截图伪造结果。

重新生成的复杂插画不是从原图复制像素，因此只能承诺同一区域内的角色、轮廓、比例、配色和视觉重量接近，不能承诺逐像素相同。QA 会把这类区域和原生重建区域分开判断。

## 当前边界

- 一次运行处理一张单页框架图；
- PowerPoint 是可编辑成品的事实源，暂不输出 VSDX；
- 默认最多生成 32 种不同的复杂素材，每种最多尝试两次；超过预算不会静默漏图，而会要求提高预算或返回问题包；
- 实时图像生成只在 Codex Desktop 中执行；GitHub Actions 只跑静态测试、单元测试和录制回放；
- `rebuild` 是当前发布重点；`author` 已接入完整状态机，但仍会继续加强论文解析和母图筛选。

## 给贡献者

<details>
<summary>状态机、命令行和测试</summary>

Skill 位于 `plugins/paper-figure-loom/skills/rebuild-paper-figures`，公开 JSON 契约位于 [`contracts/`](contracts/) 中。

Codex 正常使用时会自动驱动唯一入口 `forge.mjs`。调试时可以创建：

```json
{
  "mode": "rebuild",
  "master_image": "/absolute/path/to/master.png",
  "output_dir": "/absolute/path/to/delivery"
}
```

然后使用 Codex Desktop 自带的 Node：

```bash
<bundled-node> plugins/paper-figure-loom/skills/rebuild-paper-figures/scripts/forge.mjs init \
  --request /absolute/path/to/request.json \
  --run-dir /absolute/path/to/run

<bundled-node> plugins/paper-figure-loom/skills/rebuild-paper-figures/scripts/forge.mjs next \
  --run-dir /absolute/path/to/run
```

继续执行 `next` 返回的动作即可。可用命令为 `init`、`next`、`record`、`validate`、`build`、`qa` 和 `package`。不要手改 `run-state.json`。

确定性检查：

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run validate
```

公开测试使用原创合成母图和录制资产，不调用实时图像生成。发布前还会运行官方 Skill/Plugin 校验，并在 Codex Desktop 中构建真实 PPTX。

</details>

## 许可证

代码采用 MIT License。用户提供的论文、母图、参考图和生成产物保留各自的来源与权利边界。
