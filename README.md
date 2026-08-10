# Paper Diagram Forge

Paper Diagram Forge is a Codex plugin that turns a single-page academic or technical framework-diagram master into:

- an editable PowerPoint file;
- a composite SVG and PNG;
- reusable PNG/SVG child assets;
- visual-difference and editability evidence;
- a resumable provenance-backed delivery archive.

It also supports an authoring mode that creates master candidates from a paper, prompt, or style references before running the same rebuild pipeline.

## Design guarantees

- Text, panels, and connectors remain native PowerPoint objects.
- Complex illustrations may remain raster images inside both PPTX and SVG.
- Every SVG asset declares whether it is `native-vector` or `embedded-raster`.
- The full master image is never used as a hidden slide-sized fidelity shortcut.
- Live image generation uses Codex's built-in image-generation capability; this repository contains no API-key runner.
- Interrupted work resumes from atomic `run-state.json` checkpoints.

## Install from a local clone

Add this repository as a marketplace source:

```bash
codex plugin marketplace add /absolute/path/to/paper-diagram-forge
```

Restart the Codex app, open Plugins, select the `personal` marketplace source, and install Paper Diagram Forge.

For a GitHub-hosted clone, replace the local path with the repository shorthand and optionally pin a ref:

```bash
codex plugin marketplace add OWNER/paper-diagram-forge --ref main
```

The plugin is located under `plugins/paper-diagram-forge`; the repository marketplace resolves it automatically.

## Invoke

Attach a master image and ask:

```text
$build-paper-framework-diagrams
Rebuild this framework diagram as editable PPTX and honest hybrid SVG assets.
Run automated QA and return only the final delivery package.
```

Or attach a paper and style references and ask the skill to create master candidates first.

The first supported runtime is Codex Desktop local mode. The skill loads the bundled Node and presentation dependencies, then drives `forge.mjs` until delivery or a bounded blocker report.

## Runtime contracts

Public JSON contracts live under [`contracts/`](contracts/). A run contains:

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

The command surface is:

```bash
node plugins/paper-diagram-forge/skills/build-paper-framework-diagrams/scripts/forge.mjs help
```

## Development

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run validate
```

CI runs contract, state, SVG, and recorded replay tests without live image generation. Local release validation additionally uses the official Skill and Plugin validators and a Codex Desktop PPTX build.

The `tests/fixtures/vector` and `tests/fixtures/hybrid` diagrams are original synthetic fixtures. The desktop-only artifact-tool smoke test skips itself when that bundled runtime is not available; GitHub Actions still replays the complete deterministic state, SVG, QA, and package path with a recorded editable PPTX fixture.

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
