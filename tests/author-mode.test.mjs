import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createMasterFromFixture, fixturePath, json, runForge, temporaryDirectory } from "./helpers.mjs";

function candidate(id, semanticComplete, missingModules = []) {
  return {
    id,
    prompt: `Original candidate prompt for ${id}`,
    semantic_complete: semanticComplete,
    missing_modules: missingModules,
    rejection_reason: semanticComplete ? null : `Missing ${missingModules.join(", ")}`,
    scores: {
      semantic_completeness: semanticComplete ? 1 : 0.5,
      visual_hierarchy: 0.8,
      occlusion: 0.9,
      decomposability: 0.85,
      style_consistency: 0.82
    }
  };
}

test("author mode rejects incomplete canonical masters and persists a valid candidate decision", async () => {
  const root = await temporaryDirectory("paper-diagram-author-");
  const runDir = path.join(root, "run");
  const requestPath = path.join(root, "request.json");
  await fs.writeFile(requestPath, `${JSON.stringify({ mode: "author", prompt: "An original three-stage method diagram" }, null, 2)}\n`);
  await runForge(["init", "--request", requestPath, "--run-dir", runDir]);
  await runForge(["record", "--run-dir", runDir, "--stage", "design", "--artifact", fixturePath("vector", "design-spec.json")]);
  assert.equal((await runForge(["next", "--run-dir", runDir])).action, "imagegen.generate_master_candidates");

  const master = await createMasterFromFixture("vector", path.join(root, "candidate.png"));
  const reportPath = path.join(root, "master-candidates.json");
  const report = {
    schema_version: "1.0",
    selected_id: "candidate-c",
    candidates: [candidate("candidate-a", true), candidate("candidate-b", true), candidate("candidate-c", false, ["output-panel"])]
  };
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  await assert.rejects(
    runForge(["record", "--run-dir", runDir, "--stage", "master", "--artifact", master, "--candidate-report", reportPath]),
    /semantically incomplete/,
  );

  report.selected_id = "candidate-a";
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  const recorded = await runForge(["record", "--run-dir", runDir, "--stage", "master", "--artifact", master, "--candidate-report", reportPath]);
  assert.equal(recorded.status, "completed");
  const persisted = await json(path.join(runDir, "master-candidates.json"));
  assert.equal(persisted.selected_id, "candidate-a");
  assert.equal((await runForge(["next", "--run-dir", runDir])).action, "agent.write_scene_graph");
});
