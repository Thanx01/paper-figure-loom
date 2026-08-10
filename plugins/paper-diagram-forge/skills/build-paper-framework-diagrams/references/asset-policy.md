# Asset policy

Create one job per reusable semantic component, not one job per pixel island. Export distinct complex illustrations, icons, card groups, decorated UI groups, repeated components, and meaningful visual motifs. Keep ordinary text, plain borders, and individual connector segments in the scene graph.

## Strategy selection

- `native-text`: exact user- or source-controlled text. Always render as native PPTX text and SVG `<text>`.
- `native-shape`: panels, arrows, cards made from simple primitives, separators, badges, charts, and simple icons. Rebuild as native PPTX objects and true SVG.
- `direct-extract`: an unobstructed complex visual whose master background can safely remain or be removed. Crop deterministically from the master.
- `regenerate-grounded`: a complex or obstructed illustration that needs a complete independent transparent form. Generate one distinct asset per image-generation call.

Do not regenerate a simple shape. Do not direct-extract text that can be typed correctly. Prefer a larger semantic group over dozens of tiny fragments when the group is only useful as a whole.

## Manifest

```json
{
  "schema_version": "1.0",
  "jobs": [
    {
      "id": "asset-mascot",
      "source_element_ids": ["image-mascot"],
      "strategy": "regenerate-grounded",
      "vector_kind": "embedded-raster",
      "bbox": [0.04, 0.72, 0.12, 0.2],
      "status": "pending",
      "prompt": "Recreate only the mascot from the marked master region on a perfectly flat chroma-key background.",
      "reference_crop": "tmp/references/asset-mascot.png",
      "source": { "kind": "imagegen", "reference": "canonical-master.png" },
      "editable_level": "position-and-scale"
    }
  ]
}
```

Use `native-vector` only with native strategies. Use `embedded-raster` with direct extraction and grounded regeneration. Every job must declare a structured `source` and an `editable_level` of `full`, `geometry-and-style`, `position-and-scale`, or `none`. After recording, each job receives stable `output_png`, `output_svg`, attempt count, and SHA-256 fields.

Stop discovery only after both passes are complete:

1. Semantic pass: every required module, connector, UI group, and distinct complex visual has a scene element and strategy.
2. Residual pass: inspect the master for unexplained icons, decoration, and occluded visuals; every meaningful residual is added or explicitly represented by its parent component.

Enforce `max_complex_assets` from the request. If the inventory exceeds it, combine only components that are semantically inseparable; otherwise create a blocker rather than silently omit them.
