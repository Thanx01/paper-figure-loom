# Contributing

Contributions are welcome for deterministic reconstruction, contract validation, editability checks, and original test fixtures.

## Development checks

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run validate
```

Run the official Skill and Plugin validators before proposing a release. When Codex Desktop's presentation runtime is available, also run the artifact-tool smoke test and inspect its rendered slide at full resolution.

## Fixture policy

- Public fixtures must be original or clearly redistributable.
- Never commit user papers, unpublished figures, generated private assets, credentials, or private gold-standard outputs.
- Put local historical gold standards under `tests/private-fixtures/`; the directory is gitignored.

## Design constraints

- Keep `forge.mjs` as the only command-line state-machine entrypoint.
- Do not add a hidden API-key image-generation fallback.
- Do not describe an SVG containing `<image>` as fully vectorized.
- Do not replace editable slide content with a full-slide raster.
- Add a regression test for every state, contract, packaging, or rendering bug fix.
