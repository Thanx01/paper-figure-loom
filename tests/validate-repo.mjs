import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { repoRoot } from "./helpers.mjs";

const required = [
  ".agents/plugins/marketplace.json",
  "plugins/paper-diagram-forge/.codex-plugin/plugin.json",
  "plugins/paper-diagram-forge/skills/build-paper-framework-diagrams/SKILL.md",
  "plugins/paper-diagram-forge/skills/build-paper-framework-diagrams/agents/openai.yaml",
  "plugins/paper-diagram-forge/skills/build-paper-framework-diagrams/scripts/forge.mjs",
  "contracts/request.schema.json",
  "contracts/design-spec.schema.json",
  "contracts/scene-graph.schema.json",
  "contracts/assets-manifest.schema.json",
  "contracts/master-candidates.schema.json",
  "README.md",
  "README_CN.md",
  "LICENSE",
];

for (const relative of required) {
  await fs.access(path.join(repoRoot, relative));
}

for (const relative of [
  ".agents/plugins/marketplace.json",
  "plugins/paper-diagram-forge/.codex-plugin/plugin.json",
  "contracts/request.schema.json",
  "contracts/design-spec.schema.json",
  "contracts/scene-graph.schema.json",
  "contracts/assets-manifest.schema.json",
  "contracts/master-candidates.schema.json",
]) {
  JSON.parse(await fs.readFile(path.join(repoRoot, relative), "utf8"));
}

const plugin = JSON.parse(await fs.readFile(path.join(repoRoot, "plugins/paper-diagram-forge/.codex-plugin/plugin.json"), "utf8"));
assert.equal(plugin.name, "paper-diagram-forge");
assert.equal(plugin.skills, "./skills/");

const marketplace = JSON.parse(await fs.readFile(path.join(repoRoot, ".agents/plugins/marketplace.json"), "utf8"));
assert.equal(marketplace.plugins[0].source.path, "./plugins/paper-diagram-forge");

const sourceFiles = [];
async function visit(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules", "runs", "tests/private-fixtures"].includes(entry.name)) continue;
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) await visit(item);
    else if (entry.isFile()) sourceFiles.push(item);
  }
}
await visit(repoRoot);
for (const file of sourceFiles.filter((item) => item.endsWith(".mjs") && path.basename(item) !== "validate-repo.mjs")) {
  const contents = await fs.readFile(file, "utf8");
  assert.doesNotMatch(contents, /OPENAI_API_KEY/, `${file} must not require an API key`);
  assert.doesNotMatch(contents, /python-pptx/i, `${file} must not use python-pptx`);
}

process.stdout.write(`repository validation passed (${sourceFiles.length} files checked)\n`);
