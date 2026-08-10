---
name: build-paper-framework-diagrams
description: Generate or ingest a single-page academic or technical framework-diagram master, decompose it into reusable honest-hybrid SVG/PNG assets, rebuild it as an editable PPTX and composite SVG, run element-level visual QA and bounded repair loops, and package final evidence. Use for model architecture figures, method overview figures, system diagrams, framework images, editable PowerPoint reconstruction, icon/UI extraction, or paper-to-diagram requests.
---

# Build Paper Framework Diagrams

Run the complete workflow without asking for intermediate approval. Stop early only when the required input is unreadable or a required built-in capability is unavailable. Never silently switch to an API-key-backed image workflow.

## Select the mode

- Use `rebuild` when the user supplies a master image. Preserve its exact aspect ratio.
- Use `author` when the user supplies a prompt, paper, or style reference without a master. Generate three master candidates first, reject candidates missing any required module, and allow one targeted candidate retry round.
- Keep the selected `canonical-master.png` as visual truth. Keep explicit user text and source-paper semantics above master-image OCR.

## Initialize the run

1. Call `load_workspace_dependencies` and use its bundled Node executable and Node packages path.
2. Set `PAPER_DIAGRAM_FORGE_NODE_MODULES` to the returned Node packages path.
3. Initialize an artifact-tool workspace with the presentation skill's `container_tools/setup_artifact_tool_workspace.mjs --workspace <run-parent>` helper.
4. Create `request.json` from the user request. Use absolute source paths, a dedicated run directory, and an optional separate `output_dir` for final copies.
5. Run:

```bash
<bundled-node> <skill-dir>/scripts/forge.mjs init \
  --request <request.json> \
  --run-dir <run-dir>
```

5. Reuse the same run directory with `--resume` after an interruption. Do not restart completed work.

Read `references/scene-graph.md` before producing `design-spec.json` or `scene-graph.json`. Read `references/asset-policy.md` before producing `assets-manifest.json`.

## Drive the state machine

Run `forge.mjs next --run-dir <run-dir>` and execute exactly the returned action until it returns `deliver` or a blocker package action.

- For `agent.write_design_spec`, write exact text, required modules, and required connections; then record the design artifact.
- For `imagegen.generate_master_candidates`, invoke `$imagegen` once per candidate. Select by semantic completeness before aesthetics. Copy the winner into the run and record the master stage.
- For `agent.write_scene_graph`, perform both the semantic-structure pass and the unexplained-visual-residual pass. Record normalized coordinates, z-order, hierarchy, and reconstruction strategy.
- For `agent.write_asset_manifest`, export semantic UI groups and distinct complex visuals. Do not export every glyph or line as a separate asset.
- For `imagegen.generate_asset`, invoke `$imagegen` once for that distinct asset, using the master plus the state machine's target crop as references. Generate on a flat removable chroma-key background. Record the PNG with `--key-color <hex>` when background removal is needed, inspect the alpha result, and never use a CLI/API generation fallback.
- For `script.extract_asset`, use the returned `record --from-master` command.
- For `script.build`, run the returned command with the bundled Node runtime. The builder must use `@oai/artifact-tool`; never use `python-pptx`.
- For `script.qa`, run the returned command and inspect the full-resolution final render plus all QA images.
- For `agent.repair_from_qa`, change only the failing elements, rebuild, and rerun QA. Stop at the state-machine budget.
- For `script.package` or `script.package_blocker`, run the returned command and report the resulting ZIP.

Record stage artifacts with:

```bash
<bundled-node> <skill-dir>/scripts/forge.mjs record \
  --run-dir <run-dir> --stage <design|master|scene|assets> --artifact <path>
```

Record a completed image asset with `--asset-id <id> --artifact <png>`. Never edit `run-state.json` manually.
Record a rejected generation with `--asset-id <id> --failed --reason <reason>` so attempt budgets and failure evidence survive interruption. In author mode, save candidate prompts, scores, rejections, and the selected id in `master-candidates.json`, then pass it through `record --stage master ... --candidate-report <file>`.

## Preserve editability and SVG truth

Read `references/svg-policy.md` before building. Use native PPTX text, panels, and connectors. Use transparent PNG only for manifest-approved complex visuals. Never place the complete master image over the slide to fake fidelity.

Every exported asset must have both PNG and SVG forms. Mark simple rebuilt assets `native-vector`; mark SVG files that embed PNG bytes `embedded-raster`. Never call the latter fully vectorized.

## Enforce delivery gates

Read `references/qa-policy.md` before accepting the result. Require exact text and required-graph coverage, no missing assets, no unsafe SVG links, no flattened PPTX, and configured visual-difference thresholds. Inspect every final render at full size.

Return only the final PPTX, composite SVG/PNG, asset directories, manifest, QA evidence, provenance, and delivery ZIP. If the run blocks, return the blocker ZIP and the concrete failed gates instead of claiming success.
