# Paper Figure Studio

**English** | [简体中文](README_CN.md)

**Turn a paper figure into a PowerPoint you can actually edit.**

Give Paper Figure Studio a reference image—or a paper and an idea. It gives you back an editable, one-slide PowerPoint, separate visual assets, and comparison images that show how closely the result matches the source.

## Why Paper Figure Studio exists

Academic figures often reach their final form as a flat PNG. At that point, changing one label, moving one arrow, or reusing one icon means rebuilding the whole figure.

The usual workaround is just as awkward: ask an image model for cutouts, download them in batches, convert them to SVG, unpack everything locally, rebuild the slide, and repeat whenever something is missed.

Paper Figure Studio turns that handoff into one Codex task. You provide the source once and review the result at the end.

## Try it in one message

### I already have a figure

Attach the image and send:

```text
Use $craft-paper-figures to turn the attached figure into an editable PowerPoint.
Keep the wording, layout, and colors. Make the labels, boxes, and arrows individually editable,
export reusable icons separately, compare the finished slide with the original, and return only
the final files.
```

### I have a paper or an idea

Attach the paper and any style references, then send:

```text
Use $craft-paper-figures to read the attached paper and create a clear, single-page method figure.
Use the attached images as style references. Keep all labels editable, check the finished slide,
and return the PowerPoint together with the reusable visual assets.
```

That is the normal workflow. You do not need to run the build script yourself or keep sending “continue.”

## Choose your starting point

| You have | Paper Figure Studio will | Best for |
| --- | --- | --- |
| A finished PNG/JPG figure | Rebuild its wording, composition, colors, arrows, and reusable parts | Revising a published figure or recovering an editable source |
| A paper, prompt, or rough idea | Draft several complete figure directions, choose a viable one, then rebuild it | Creating a new method or system overview |

The first route is called `rebuild` in the run files. The second is called `author`. You only need those terms when inspecting or scripting a run.

## Install

Add this GitHub repository as a Codex plugin marketplace:

```bash
codex plugin marketplace add Thanx01/paper-figure-studio --ref main
```

Restart Codex Desktop, open **Plugins**, choose the **personal** marketplace, and install **Paper Figure Studio**.

To work from a local clone instead:

```bash
git clone https://github.com/Thanx01/paper-figure-studio.git
codex plugin marketplace add /absolute/path/to/paper-figure-studio
```

Paper Figure Studio currently runs in Codex Desktop local mode and uses Codex's built-in image generation. It does not ask for an `OPENAI_API_KEY`.

## What comes back

- `framework.pptx` — the main editable file;
- `framework.svg` and `framework.png` — the complete figure for other tools;
- `assets/svg/` and `assets/png/` — icons, illustrations, and reusable components;
- `assets-manifest.json` — a plain record of where each asset came from and how editable it is;
- `qa/` and `qa-report.json` — side-by-side, overlay, and difference views for checking the result;
- `paper-figure-studio-delivery.zip` — everything above in one download.

If the figure cannot pass its checks, Paper Figure Studio returns a blocker package with the failed checks and saved run state. It does not label an unfinished figure as successful.

## What stays editable

Text, boxes, panels, and arrows are rebuilt as real PowerPoint objects. You can select them, rewrite them, recolor them, or move them after delivery.

Complex artwork is handled honestly. A character, textured card, or detailed illustration may remain a transparent PNG inside the slide and inside its SVG wrapper. The asset manifest says so. Paper Figure Studio never calls a PNG “fully vector,” and it never hides the original full-page image over the slide to fake a match.

## What happens after you send the prompt

1. It locks the exact wording, required sections, and connections before drawing.
2. It reads the figure twice: once for the main structure, then again for small icons, decoration, and overlapping details that are easy to miss.
3. It redraws simple parts and extracts or regenerates complex artwork with the source figure as a visual reference.
4. It builds the slide, renders it, compares it with the source, and fixes only the parts that failed.
5. It packages the editable figure, separate assets, and comparison evidence.

The run is saved after every stage. If Codex is interrupted, point it at the same run directory:

```text
Use $craft-paper-figures to resume the run in /absolute/path/to/run-directory.
Keep the completed work and continue from run-state.json.
```

## What “1:1” means here

For text, structure, layout, and directly extracted artwork, “1:1” means matching the source within the repository's declared tolerances. For artwork that must be regenerated, it means a close visual match in the same region—not identical pixels.

This distinction matters. A useful editable figure is better than a perfect screenshot pretending to be editable.

## Current limits

- One figure and one PowerPoint slide per run.
- PowerPoint is the editable source of truth; VSDX is not produced.
- Recreated complex artwork can match the role, placement, palette, and visual weight of the source, but not every pixel.
- Live image generation runs in Codex Desktop, not in GitHub Actions.
- `rebuild` is the current release focus. The paper-to-figure `author` route is implemented but remains the next hardening track.

## For contributors

<details>
<summary>Run files, CLI, tests, and validation</summary>

The user-facing Skill lives at `plugins/paper-figure-studio/skills/craft-paper-figures`. Public JSON contracts live in [`contracts/`](contracts/).

Codex normally drives the state machine. For diagnostics, create a `request.json` with absolute paths:

```json
{
  "mode": "rebuild",
  "master_image": "/absolute/path/to/master.png",
  "output_dir": "/absolute/path/to/delivery"
}
```

Then use the Node executable bundled with Codex Desktop:

```bash
<bundled-node> plugins/paper-figure-studio/skills/craft-paper-figures/scripts/forge.mjs init \
  --request /absolute/path/to/request.json \
  --run-dir /absolute/path/to/run

<bundled-node> plugins/paper-figure-studio/skills/craft-paper-figures/scripts/forge.mjs next \
  --run-dir /absolute/path/to/run
```

Keep calling `next` and execute the action it returns. The available commands are `init`, `next`, `record`, `validate`, `build`, `qa`, and `package`. Do not edit `run-state.json` by hand.

Run the deterministic test suite with:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run validate
```

CI uses original synthetic fixtures and recorded assets; it does not call live image generation. Release checks additionally validate the Skill and plugin manifests and build a real editable PPTX inside Codex Desktop.

</details>

## License

MIT. User-provided papers, reference images, and generated run artifacts keep their own provenance and rights.
