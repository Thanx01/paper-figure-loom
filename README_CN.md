# Paper Figure Studio

[English](README.md) | **简体中文**

**把论文框架图，变成真正能改的 PowerPoint。**

给 Paper Figure Studio 一张参考图，或者一篇论文加一个想法。它会交付一页可编辑的 PowerPoint、拆分好的视觉素材，以及用来核对还原效果的对比图。

## 为什么要做 Paper Figure Studio

很多论文框架图做到最后，只剩下一张扁平的 PNG。此时哪怕只改一个词、挪一根箭头、复用一个图标，也可能要把整张图重新做一遍。

过去常见的解决办法同样麻烦：反复让图像模型抠图，分批下载，转成 SVG，再到本地解压、拼回 PPT；漏了一个小图标，就要继续重复前面的步骤。

Paper Figure Studio 把这些动作收进一次 Codex 任务。你只需要提供一次材料，最后验收结果。

## 一句话开始

### 已经有框架图

附上图片，然后发送：

```text
使用 $craft-paper-figures，把附件中的框架图复刻成可编辑 PowerPoint。
保留原图的文字、布局和配色；文字、方框和连线必须能单独修改；
把可复用的图标分别导出；完成后对照原图检查，只交付最终文件。
```

### 只有论文或想法

附上论文和可选的风格参考图，然后发送：

```text
使用 $craft-paper-figures，阅读附件论文并制作一张清楚的单页方法框架图。
参考附件图片的风格，所有文字都要能编辑；完成后自动检查，
并交付 PowerPoint 和拆分好的视觉素材。
```

正常使用到这里就够了。你不需要手工运行脚本，也不需要一遍遍发送“继续”。

## 你可以从哪里开始

| 你手里有什么 | Paper Figure Studio 会做什么 | 适合什么场景 |
| --- | --- | --- |
| 一张已经完成的 PNG/JPG 框架图 | 复刻文字、构图、配色、箭头和可复用组件 | 修改已发表图片，或找回丢失的可编辑源文件 |
| 论文、提示词或一个粗略想法 | 先设计几套完整方案，选出可用的一套，再制作可编辑版本 | 新论文的方法图、模型图或系统总览图 |

在运行文件中，第一种方式叫 `rebuild`，第二种叫 `author`。只有在查看运行状态或写脚本时才需要记住这两个名字。

## 安装

把这个 GitHub 仓库添加为 Codex 插件市场：

```bash
codex plugin marketplace add Thanx01/paper-diagram-forge --ref main
```

重启 Codex Desktop，打开 **Plugins（插件）**，选择 **personal（个人）** 市场，然后安装 **Paper Figure Studio**。

如果要从本地仓库安装：

```bash
git clone https://github.com/Thanx01/paper-diagram-forge.git
codex plugin marketplace add /absolute/path/to/paper-diagram-forge
```

Paper Figure Studio 目前运行在 Codex Desktop 本地模式中，直接使用 Codex 内置的图像生成能力，不需要配置 `OPENAI_API_KEY`。

## 最后会拿到什么

- `framework.pptx`：最重要的可编辑成品；
- `framework.svg` 和 `framework.png`：方便放进其他软件的完整框架图；
- `assets/svg/` 和 `assets/png/`：单独拆出的图标、插画和组件；
- `assets-manifest.json`：说明每个素材从哪里来、能编辑到什么程度；
- `qa/` 和 `qa-report.json`：并排图、叠加图和差异图，用来检查还原效果；
- `paper-figure-studio-delivery.zip`：包含以上全部内容的交付压缩包。

如果结果没有通过检查，Paper Figure Studio 会返回一个问题包，里面写清楚未通过的项目并保存当前进度，而不会把半成品冒充成成功结果。

## 哪些内容真的可以编辑

文字、方框、面板和箭头都会重建成真正的 PowerPoint 对象。交付之后，你可以单独选中、改字、换颜色或移动位置。

复杂插画则会诚实处理。人物、带纹理的卡牌或细节很多的插画，可能仍然是带透明背景的 PNG，只是被放进 PPT 和 SVG 中。素材清单会明确写出来。Paper Figure Studio 不会把 PNG 宣称成“纯矢量”，也不会拿整张原图盖在幻灯片上伪装还原度。

## 发送指令之后，会自动发生什么

1. 先确定不能写错的文字、必须出现的模块和连接关系。
2. 看两遍原图：第一遍理清主要结构，第二遍专门寻找容易漏掉的小图标、装饰和遮挡细节。
3. 简单元素直接重画；复杂插画则参考原图提取或重新生成。
4. 生成 PPT，渲染成图片与原图对照，只修不合格的部分。
5. 打包可编辑成品、独立素材和对比证据。

每完成一个阶段都会保存进度。如果 Codex 中断了，把同一个运行目录交给它即可继续：

```text
使用 $craft-paper-figures，继续 /absolute/path/to/run-directory 中未完成的任务。
保留已经完成的内容，从 run-state.json 记录的位置继续。
```

## 这里说的“1:1”是什么

对文字、结构、布局和直接提取的素材，“1:1”是指处于仓库规定的误差范围内。对必须重新生成的复杂插画，它表示在同一位置保持接近的内容、配色和视觉重量，而不是每个像素完全相同。

这个区别很重要：一张真正能修改的高还原框架图，比一张假装可编辑的完美截图更有价值。

## 目前的边界

- 一次任务只处理一张图，输出一页 PowerPoint。
- PowerPoint 是权威可编辑成品；暂不生成 VSDX。
- 重新生成的复杂插画可以保持用途、位置、配色和视觉重量，但不能保证逐像素一致。
- 实时图像生成只在 Codex Desktop 中运行，不会放进 GitHub Actions。
- 当前发布重点是复刻已有图片；从论文直接创作的 `author` 路线已经接入，但仍是下一阶段重点打磨的部分。

## 给贡献者

<details>
<summary>运行文件、命令行和测试方式</summary>

用户调用的 Skill 位于 `plugins/paper-diagram-forge/skills/craft-paper-figures`，公开 JSON 契约位于 [`contracts/`](contracts/) 中。

Codex 通常会自动驱动状态机。排查问题时，可以用绝对路径创建 `request.json`：

```json
{
  "mode": "rebuild",
  "master_image": "/absolute/path/to/master.png",
  "output_dir": "/absolute/path/to/delivery"
}
```

然后使用 Codex Desktop 自带的 Node：

```bash
<bundled-node> plugins/paper-diagram-forge/skills/craft-paper-figures/scripts/forge.mjs init \
  --request /absolute/path/to/request.json \
  --run-dir /absolute/path/to/run

<bundled-node> plugins/paper-diagram-forge/skills/craft-paper-figures/scripts/forge.mjs next \
  --run-dir /absolute/path/to/run
```

继续执行 `next` 返回的动作即可。完整命令包括 `init`、`next`、`record`、`validate`、`build`、`qa` 和 `package`。不要手工修改 `run-state.json`。

确定性测试命令：

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run validate
```

CI 使用原创合成样例和录制资产，不会调用实时图像生成。发布检查还会验证 Skill 与插件清单，并在 Codex Desktop 中构建真正可编辑的 PPTX。

</details>

## 许可证

代码采用 MIT License。用户提供的论文、参考图和运行产物仍然保留各自的来源与权利边界。
