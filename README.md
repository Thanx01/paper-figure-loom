# Paper Diagram Forge

**English** | [简体中文](README_CN.md)

Paper Diagram Forge is a Codex Desktop plugin for producing editable, publication-ready, single-page academic framework diagrams. It can either reconstruct an existing master image or create a canonical master from a paper, prompt, and style references before rebuilding it.

One Skill call drives the complete workflow: design contract, master selection, two-pass scene decomposition, asset generation or extraction, editable PPTX construction, hybrid SVG export, visual QA, bounded repairs, and final packaging.

## What you receive

Every successful run delivers:

- `framework.pptx` — the authoritative editable result;
- `framework.svg` and `framework.png` — composite exports;
- `assets/png/` and `assets/svg/` — reusable child assets;
- `assets-manifest.json` — source, vector type, and editability metadata for every asset;
- `qa/` and `qa-report.json` — side-by-side, overlay, heatmap, bounding-box, and gate evidence;
- `paper-diagram-forge-delivery.zip` — the complete delivery package.

## Design guarantees

- Text, panels, and connectors remain native PowerPoint objects.
- Complex illustrations may remain raster images inside both PPTX and SVG.
- Every SVG asset declares whether it is `native-vector` or `embedded-raster`.
- The full master image is never used as a hidden slide-sized fidelity shortcut.
- Live image generation uses Codex's built-in image-generation capability; no `OPENAI_API_KEY` is required.
- Interrupted work resumes from atomic `run-state.json` checkpoints.
- Explicit user text and paper semantics take precedence over incorrect text detected in a master image.

## Requirements

- Codex Desktop in local mode.
- A master image for `rebuild` mode, or at least one paper PDF, prompt, or style reference for `author` mode.
- PowerPoint is recommended for the final human review, but it is not required to run the automated pipeline.

The first release does not provide a standalone API-key runner or headless cloud service.

## Install

### From GitHub

Add this repository as a personal marketplace source:

```bash
codex plugin marketplace add Thanx01/paper-diagram-forge --ref main
```

Restart Codex Desktop, open **Plugins**, select the **personal** marketplace, and install **Paper Diagram Forge**.

### From a local clone

```bash
git clone https://github.com/Thanx01/paper-diagram-forge.git
codex plugin marketplace add /absolute/path/to/paper-diagram-forge
```

Restart Codex Desktop and install the plugin from the **personal** marketplace. The marketplace manifest automatically resolves the plugin under `plugins/paper-diagram-forge`.

## Quick start

For normal use, do not run `forge.mjs` manually. Start a Codex task, attach the source files, and invoke the Skill once. The Skill continues through all non-interactive stages and returns only a successful delivery or a concrete blocker package.

### Rebuild an existing diagram

Attach the master image and send:

```text
$build-paper-framework-diagrams
Rebuild the attached framework diagram as an editable PPTX and honest hybrid SVG assets.
Preserve its text, structure, relative layout, colors, and aspect ratio. Run automated QA
and return the final delivery package only.
```

The master controls layout and visual style. Explicit corrections in your message control the final editable text and diagram semantics.

### Author a diagram from a paper or prompt

Attach the paper PDF and any optional style-reference images, then send:

```text
$build-paper-framework-diagrams
Read the attached paper and create a single-page 16:9 method framework diagram in the
style of the attached references. Keep all labels editable, generate and evaluate the
master candidates, rebuild the selected master, run QA, and return the final package only.
```

You can also provide a detailed text prompt without a PDF. Author mode generates three candidates by default, permits one targeted retry if all candidates fail, and then sends the selected canonical master through the same rebuild pipeline.

### Resume an interrupted run

Keep the run directory and ask Codex:

```text
$build-paper-framework-diagrams
Resume the interrupted Paper Diagram Forge run at /absolute/path/to/run-directory.
Use its existing run-state.json and do not repeat completed stages or validated assets.
```

Stage writes are atomic and idempotent. Validated stages and assets are skipped after a restart.

## Input reference

| Input | Rebuild | Author | Meaning |
| --- | --- | --- | --- |
| `mode` | `rebuild` | `author` | Selects the workflow. |
| `master_image` | Required | Not used | Absolute path to the canonical source image. |
| `paper_pdf` | Optional semantic source | Optional | Absolute path to a paper PDF. |
| `prompt` | Optional corrections | Optional | Diagram requirements, exact text, or style direction. |
| `style_references` | Optional | Optional | Absolute paths to reference images. |
| `aspect_ratio` | Preserved from master | Defaults to `16:9` | Output canvas ratio. |
| `output_dir` | Optional | Optional | Directory that receives final delivery copies. |

Default budgets are three master candidates, one candidate retry round, at most 32 generated complex assets, two attempts per asset, and three repair rounds. They can be overridden in `request.json` when a specialized run requires it.

## What runs automatically

1. Build a design contract containing exact text, required modules, and required connections.
2. Accept the supplied master or generate, score, and select a canonical master.
3. Perform a semantic-structure pass and an unexplained-visual-residual pass.
4. Classify every element as native text, native shape, direct extraction, or grounded regeneration.
5. Build honest native-vector or embedded-raster SVG/PNG assets.
6. Construct a single-slide PPTX with native text, panels, and connectors.
7. Render and compare the result with element-level and global QA evidence.
8. Repair only failing elements until the gates pass or the bounded repair budget ends.
9. Produce a delivery ZIP, or a blocker ZIP with recoverable state and failed-gate details.

## QA and the meaning of “1:1”

“1:1” means that structure, layout, exact text, and directly extracted assets remain within the declared tolerances. Regenerated complex illustrations promise region-level visual consistency, not pixel identity.

The hard gates require complete modules, connections, and exact text; no missing or duplicate assets; no unexpected overlaps, clipping, or out-of-bounds objects; native PPTX text/panels/connectors; safe self-contained SVG files; and configured global and element-level difference thresholds. A whole-slide master-image overlay cannot satisfy the editability gate.

## Advanced: state-machine CLI

This section is for development and recovery diagnostics. Codex Desktop normally discovers its bundled Node runtime and presentation dependencies automatically.

Create a request file with absolute paths:

```json
{
  "mode": "rebuild",
  "master_image": "/absolute/path/to/master.png",
  "output_dir": "/absolute/path/to/delivery"
}
```

Author-mode example:

```json
{
  "mode": "author",
  "paper_pdf": "/absolute/path/to/paper.pdf",
  "prompt": "Create a single-page editable 16:9 method overview.",
  "style_references": ["/absolute/path/to/style.png"],
  "aspect_ratio": "16:9"
}
```

Use the bundled Node executable returned by the Codex Desktop workspace runtime:

```bash
<bundled-node> plugins/paper-diagram-forge/skills/build-paper-framework-diagrams/scripts/forge.mjs init \
  --request /absolute/path/to/request.json \
  --run-dir /absolute/path/to/run

<bundled-node> plugins/paper-diagram-forge/skills/build-paper-framework-diagrams/scripts/forge.mjs next \
  --run-dir /absolute/path/to/run
```

Continue executing the action returned by `next`. The full command surface is:

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

Do not edit `run-state.json` by hand. Image generation remains a Codex built-in tool action; the CLI intentionally does not pretend it can call a conversational image tool.

## Troubleshooting

- **The plugin is not listed:** restart Codex Desktop after adding the marketplace, then check the **personal** source.
- **Presentation dependencies are unavailable:** run inside Codex Desktop local mode so the Skill can load the bundled runtime and `@oai/artifact-tool`.
- **A generated asset repeatedly fails:** the attempt and reason are recorded; the run ends with a blocker package instead of silently substituting an unrelated image.
- **QA does not pass:** inspect `qa-report.json` and the `qa/` comparison images. The repair loop changes only failing elements and stops at its configured limit.
- **An SVG contains an `<image>` element:** this is expected for `embedded-raster` complex art and is declared in `assets-manifest.json`; it is not presented as a fully native vector.

## Runtime contracts

Public JSON contracts live under [`contracts/`](contracts/). A run persists:

```text
request.json
design-spec.json
master-candidates.json (author mode)
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

## Development

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run validate
```

CI runs contract, state, SVG, documentation, and recorded replay tests without live image generation. Local release validation additionally uses the official Skill and Plugin validators and a Codex Desktop PPTX build.

The `tests/fixtures/vector` and `tests/fixtures/hybrid` diagrams are original synthetic fixtures. The desktop-only artifact-tool smoke test skips itself when the bundled runtime is unavailable; GitHub Actions still replays the complete deterministic state, SVG, QA, and package path with a recorded editable PPTX fixture.

Place non-public historical fixtures under `tests/private-fixtures/`; that directory is ignored. Only original or redistribution-safe fixtures belong in the repository.

## Current boundaries

- One diagram canvas per run.
- PPTX is the authoritative editable format; VSDX is not generated.
- No GitHub Actions image generation and no headless OpenAI API backend.
- Regenerated complex illustrations target region-level visual similarity, not pixel identity.

## Roadmap

- `v0.1 rebuild`: master-first reconstruction, honest hybrid assets, editable PPTX, bounded QA, and delivery/blocker packages.
- `v1 author`: paper/prompt/style-reference master candidate generation and selection feeding the same rebuild engine.
- Deferred: VSDX, multi-page decks, API-key batch operation, MCP service mode, and live generation in CI.

## License

MIT. Third-party or user-supplied inputs and generated run artifacts retain their own provenance and are not covered merely because the code is MIT licensed.
