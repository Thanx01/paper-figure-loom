import assert from "node:assert/strict";
import test from "node:test";
import {
  duplicateAssetGroups,
  normalizeRequest,
  validateAssetManifest,
  validateDesignSpec,
  validateRequest,
  validateSceneGraph,
} from "../plugins/paper-figure-studio/skills/craft-paper-figures/scripts/lib/contracts.mjs";
import { fixturePath, json } from "./helpers.mjs";

test("public fixtures satisfy all semantic contracts", async () => {
  for (const name of ["vector", "hybrid"]) {
    const design = await json(fixturePath(name, "design-spec.json"));
    const scene = await json(fixturePath(name, "scene-graph.json"));
    const assets = await json(fixturePath(name, "assets-manifest.json"));
    assert.equal(validateDesignSpec(design).valid, true);
    assert.equal(validateSceneGraph(scene).valid, true);
    assert.equal(validateAssetManifest(assets, scene).valid, true);
  }
});

test("asset content hashes identify duplicate jobs", () => {
  const manifest = {
    jobs: [
      { id: "a", sha256_png: "same" },
      { id: "b", sha256_png: "same" },
      { id: "c", sha256_png: "different" },
    ],
  };
  assert.deepEqual(duplicateAssetGroups(manifest), [{ sha256: "same", ids: ["a", "b"] }]);
});

test("request defaults encode the bounded generation and repair budgets", async () => {
  const request = await normalizeRequest({ mode: "author", prompt: "A small original diagram" }, "/tmp/request.json");
  assert.deepEqual(request.budgets, {
    master_candidates: 3,
    master_retry_rounds: 1,
    max_complex_assets: 32,
    max_asset_attempts: 2,
    max_repair_rounds: 3,
    stop_after_no_improvement_rounds: 1,
  });
  assert.equal((await validateRequest(request)).valid, true);
});

test("invalid duplicates and dishonest raster SVG declarations are rejected", async () => {
  const scene = await json(fixturePath("vector", "scene-graph.json"));
  const duplicateScene = structuredClone(scene);
  duplicateScene.elements.push(structuredClone(duplicateScene.elements[0]));
  assert.equal(validateSceneGraph(duplicateScene).valid, false);

  const assets = await json(fixturePath("hybrid", "assets-manifest.json"));
  assets.jobs.find((job) => job.id === "grounded-visual-asset").vector_kind = "native-vector";
  const result = validateAssetManifest(assets, await json(fixturePath("hybrid", "scene-graph.json")));
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /embedded-raster/);
});
