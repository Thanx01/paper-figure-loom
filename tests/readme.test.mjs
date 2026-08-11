import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { repoRoot } from "./helpers.mjs";

const englishPath = path.join(repoRoot, "README.md");
const chinesePath = path.join(repoRoot, "README_CN.md");

test("English and Chinese READMEs link to each other and document real usage", async () => {
  const [english, chinese] = await Promise.all([
    fs.readFile(englishPath, "utf8"),
    fs.readFile(chinesePath, "utf8"),
  ]);

  assert.match(english, /\[简体中文\]\(README_CN\.md\)/);
  assert.match(chinese, /\[English\]\(README\.md\)/);

  for (const readme of [english, chinese]) {
    assert.match(readme, /codex plugin marketplace add Thanx01\/paper-figure-loom --ref main/);
    assert.match(readme, /\$rebuild-paper-figures/);
    assert.match(readme, /forge\.mjs init/);
    assert.match(readme, /forge\.mjs next/);
    assert.match(readme, /run-state\.json/);
    assert.match(readme, /paper-figure-loom-delivery\.zip/);
  }
});
