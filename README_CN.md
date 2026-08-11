# Paper Diagram Forge

[English](README.md) | **简体中文**

Paper Diagram Forge 是一个面向 Codex 桌面端的插件，用于制作可编辑、可验收、适合论文投稿的单页学术框架图。它既可以复刻已有母图，也可以先根据论文、提示词和风格参考生成并选定母图，再进入同一套重建流程。

用户只需调用一次 Skill，后续设计契约、母图选择、两遍场景拆解、资产生成或提取、可编辑 PPTX 构建、混合 SVG 导出、视觉验收、定向修复和最终打包都会自动推进。

## 最终会得到什么

每次成功运行都会交付：

- `framework.pptx`：权威的可编辑成品；
- `framework.svg` 和 `framework.png`：完整框架图导出；
- `assets/png/` 和 `assets/svg/`：可复用的独立子资产；
- `assets-manifest.json`：每项资产的来源、矢量类型和可编辑性说明；
- `qa/` 和 `qa-report.json`：并排图、叠加图、热力差异图、边界框图和门禁证据；
- `paper-diagram-forge-delivery.zip`：完整交付压缩包。

## 设计保证

- 文字、面板和连接器在 PowerPoint 中保持原生对象。
- 复杂人物、插画、阴影和纹理可以作为栅格图保留在 PPTX 与 SVG 中。
- 每个 SVG 都会如实标记为 `native-vector` 或 `embedded-raster`。
- 不会用整页母图作为隐藏背景来伪造“高还原度”。
- 实时图像生成使用 Codex 内置图像生成能力，不需要 `OPENAI_API_KEY`。
- 中断后可以从原子写入的 `run-state.json` 恢复。
- 用户明确给出的文字和论文语义高于母图 OCR；母图里的错误文字不会覆盖正确设计契约。

## 使用前提

- 在 Codex Desktop 本地模式中运行。
- `rebuild` 模式需要一张母图；`author` 模式至少需要论文 PDF、文字提示词或风格参考中的一种。
- 建议最后使用 PowerPoint 进行人工终验，但运行自动链路本身不要求安装 PowerPoint。

首版不提供独立 API Key 执行器，也不提供无界面的云端服务。

## 安装

### 从 GitHub 安装

把本仓库添加为个人插件市场源：

```bash
codex plugin marketplace add Thanx01/paper-diagram-forge --ref main
```

重启 Codex Desktop，打开 **Plugins（插件）**，选择 **personal（个人）** 市场源，然后安装 **Paper Diagram Forge**。

### 从本地克隆安装

```bash
git clone https://github.com/Thanx01/paper-diagram-forge.git
codex plugin marketplace add /absolute/path/to/paper-diagram-forge
```

重启 Codex Desktop，并在 **personal** 市场源中安装插件。仓库市场清单会自动定位 `plugins/paper-diagram-forge` 下的插件目录。

## 快速使用

普通用户不需要手工运行 `forge.mjs`。新建一个 Codex 任务，附加输入文件，然后调用一次 Skill 即可。Skill 会持续执行所有不需要人工确认的阶段，最终只返回合格交付包，或者返回包含明确原因的 blocker 包。

### 模式一：复刻已有框架图

附加母图后发送：

```text
$build-paper-framework-diagrams
请将附件中的框架图重建为可编辑 PPTX 和如实标注类型的混合 SVG 资产。
保持原图的文字、结构、相对位置、配色和纵横比，自动完成视觉验收，
中间无需让我确认，只返回最终交付包。
```

母图负责布局和视觉风格；如果你在消息中明确修正了文字或连接关系，最终可编辑内容会以你的修正为准。

### 模式二：从论文或提示词创作框架图

附加论文 PDF 和可选的风格参考图后发送：

```text
$build-paper-framework-diagrams
阅读附件论文，参考附件图片的风格，制作一张单页 16:9 方法框架图。
所有标签都要可编辑；自动生成并评估母图候选，复刻最佳母图，完成 QA，
中间无需让我确认，只返回最终交付包。
```

也可以不附加 PDF，只提供足够详细的文字提示词。`author` 模式默认生成 3 个候选；如果全部不合格，只允许 1 轮针对性补生成；选定 canonical master 后，自动进入与 `rebuild` 完全相同的重建链路。

### 中断后继续

保留原运行目录，并向 Codex 发送：

```text
$build-paper-framework-diagrams
请继续 /absolute/path/to/run-directory 中断的 Paper Diagram Forge 任务。
沿用已有 run-state.json，不要重复已完成阶段或已通过验证的资产。
```

所有阶段写入都是原子化且幂等的，重启后会跳过已经验证通过的阶段和资产。

## 输入参数说明

| 输入项 | Rebuild | Author | 作用 |
| --- | --- | --- | --- |
| `mode` | `rebuild` | `author` | 选择工作模式。 |
| `master_image` | 必需 | 不使用 | canonical master 的绝对路径。 |
| `paper_pdf` | 可选语义来源 | 可选 | 论文 PDF 的绝对路径。 |
| `prompt` | 可选修正信息 | 可选 | 框架图要求、精确文字或风格方向。 |
| `style_references` | 可选 | 可选 | 风格参考图的绝对路径列表。 |
| `aspect_ratio` | 沿用母图 | 默认 `16:9` | 输出画布纵横比。 |
| `output_dir` | 可选 | 可选 | 最终交付文件的复制目录。 |

默认预算为：3 个母图候选、1 轮候选补生成、最多 32 个复杂生成资产、每项资产最多 2 次尝试、最多 3 轮修复。特殊任务可以在 `request.json` 中覆盖这些预算。

## 自动链路具体做什么

1. 建立包含逐字文字、必需模块和必需连接的设计契约。
2. 接受用户母图，或自动生成、评分并选定 canonical master。
3. 分别执行语义结构识别和未解释视觉残差识别。
4. 将每个元素固定分类为原生文字、原生形状、直接提取或参考母图再生成。
5. 构建如实标注的原生矢量或内嵌栅格 SVG/PNG 资产。
6. 创建单页 PPTX，文字、面板和连接器保持原生可编辑。
7. 渲染结果，并进行元素级与全局视觉验收。
8. 只修复不合格元素，直到通过门禁或用完有界修复预算。
9. 生成最终交付 ZIP；如果无法通过，则生成包含可恢复状态和失败门禁的 blocker ZIP。

## QA 与“1:1”的含义

这里的“1:1”是指结构、布局、逐字文字和直接提取资产处于规定误差内。对重新生成的复杂插画，只承诺区域级视觉一致，不承诺逐像素相同。

硬门禁包括：模块、连接和文字完整；没有缺失或重复资产；没有意外重叠、裁切或越界；PPTX 的文字、面板和连接器均为原生对象；SVG 自包含且安全；全局与元素级差异率不超过配置阈值。用整页母图覆盖幻灯片无法通过可编辑性门禁。

## 高级用法：状态机命令行

本节仅面向开发和故障恢复。正常情况下，Codex Desktop 会自动发现内置 Node 运行时和演示文稿依赖。

先使用绝对路径创建请求文件：

```json
{
  "mode": "rebuild",
  "master_image": "/absolute/path/to/master.png",
  "output_dir": "/absolute/path/to/delivery"
}
```

`author` 模式示例：

```json
{
  "mode": "author",
  "paper_pdf": "/absolute/path/to/paper.pdf",
  "prompt": "制作一张单页、可编辑的 16:9 方法概览图。",
  "style_references": ["/absolute/path/to/style.png"],
  "aspect_ratio": "16:9"
}
```

使用 Codex Desktop 工作区运行时返回的 Node 可执行文件：

```bash
<bundled-node> plugins/paper-diagram-forge/skills/build-paper-framework-diagrams/scripts/forge.mjs init \
  --request /absolute/path/to/request.json \
  --run-dir /absolute/path/to/run

<bundled-node> plugins/paper-diagram-forge/skills/build-paper-framework-diagrams/scripts/forge.mjs next \
  --run-dir /absolute/path/to/run
```

之后持续执行 `next` 返回的动作。完整命令界面如下：

```text
init     --request request.json [--run-dir path] [--resume]
next     --run-dir path
record   --run-dir path --stage design|master|scene|assets --artifact file
record   --run-dir path --asset-id id (--artifact image [--key-color hex]|--from-master|--failed --reason text)
validate --run-dir path
build    --run-dir path [--skip-pptx]
qa       --run-dir path
package  --run-dir path
```

不要手工编辑 `run-state.json`。图像生成仍然由 Codex 内置工具完成；CLI 不会伪装成能够调用对话式图像工具。

## 常见问题

- **插件列表里找不到：** 添加市场源后重启 Codex Desktop，并检查 **personal** 市场源。
- **演示文稿依赖不可用：** 请在 Codex Desktop 本地模式中运行，让 Skill 加载内置运行时和 `@oai/artifact-tool`。
- **某个生成资产连续失败：** 尝试次数和失败原因都会被记录；系统会生成 blocker 包，不会悄悄替换成无关图片。
- **QA 未通过：** 查看 `qa-report.json` 和 `qa/` 中的对比图。修复循环只修改不合格元素，并在到达预算后停止。
- **SVG 中出现 `<image>`：** 对 `embedded-raster` 复杂插画来说这是预期行为，且会在 `assets-manifest.json` 中明确披露，不会被宣称为纯原生矢量。

## 运行产物与契约

公开 JSON Schema 位于 [`contracts/`](contracts/) 中。每次运行会持久化：

```text
request.json
design-spec.json
master-candidates.json（author 模式）
canonical-master.png
scene-graph.json
assets-manifest.json
run-state.json
qa-report.json
framework.pptx
framework.svg
framework.png
assets/png/
assets/svg/
qa/
paper-diagram-forge-delivery.zip
```

## 开发与测试

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run validate
```

CI 在不调用实时图像生成的情况下执行契约、状态、SVG、文档和录制回放测试。发布前的本地验证还会执行官方 Skill/Plugin 校验器，并在 Codex Desktop 中构建和检查 PPTX。

`tests/fixtures/vector` 和 `tests/fixtures/hybrid` 是原创合成夹具。无法使用 Codex 内置运行时时，桌面端 artifact-tool 冒烟测试会自动跳过；GitHub Actions 仍会使用录制的可编辑 PPTX 夹具重放完整的确定性状态、SVG、QA 和打包链路。

非公开历史样例应放在已忽略的 `tests/private-fixtures/` 中。公开仓库只允许使用原创或明确可以再分发的夹具。

## 当前边界

- 每次运行只处理一张单页框架图。
- PPTX 是权威可编辑格式；暂不生成 VSDX。
- GitHub Actions 不进行实时图像生成，也没有 Headless OpenAI API 后端。
- 重新生成的复杂插画只追求区域级视觉相似，不承诺逐像素一致。

## 路线图

- `v0.1 rebuild`：母图优先复刻、如实混合资产、可编辑 PPTX、有界 QA 和交付/blocker 包。
- `v1 author`：论文、提示词和风格参考生成母图候选，选定后复用同一重建引擎。
- 后置范围：VSDX、多页演示、API Key 批处理、MCP 服务模式和 CI 实时生成。

## 许可证

代码采用 MIT License。第三方或用户输入，以及由它们生成的运行产物，仍然保留各自的来源与权利边界，不会仅因本仓库代码使用 MIT 而自动获得相同许可。
