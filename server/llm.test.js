import test from "node:test";
import assert from "node:assert/strict";
import { generateAnswer } from "./llm.js";
const sources = [{ title: "Annaly", text: "Worked on C# APIs." }];

test("sends retrieved evidence and returns provider text", async () => {
  const reply = await generateAnswer("Annaly experience?", sources, {
    apiKey: "test-key",
    fetchImpl: async (url, options) => {
      assert.ok(!url.includes("test-key"));
      assert.equal(options.headers["x-goog-api-key"], "test-key");
      const body = JSON.parse(options.body);
      assert.deepEqual(JSON.parse(body.contents[0].parts[0].text).references, sources);
      assert.match(body.systemInstruction.parts[0].text, /only the provided reference/);
      return { ok: true, json: async () => ({ candidates: [{ finishReason: "STOP", content: { parts: [{ text: "He worked on C# APIs." }] } }] }) };
    },
  });
  assert.equal(reply, "He worked on C# APIs.");
});
test("no evidence skips the provider even without a key", async () => {
  const reply = await generateAnswer("weather", [], { apiKey: "", fetchImpl: () => assert.fail("must not call") });
  assert.match(reply, /couldn't find/);
});
test("missing key produces a useful configuration error", async () => {
  await assert.rejects(generateAnswer("Annaly", sources, { apiKey: "" }), { status: 503 });
});
test("provider failures do not expose raw errors or retry", async () => {
  for (const status of [403, 429, 500]) {
    let calls = 0;
    await assert.rejects(generateAnswer("Annaly", sources, { apiKey: "test", fetchImpl: async () => {
      calls++;
      return { ok: false, status, json: () => assert.fail("must not read error body") };
    } }), { status: status === 429 ? 429 : 502 });
    assert.equal(calls, 1);
  }
});
test("network errors are sanitized", async () => {
  await assert.rejects(generateAnswer("Annaly", sources, { apiKey: "test", fetchImpl: async () => { throw new Error("private diagnostics"); } }), { status: 503 });
});
test("blocked, truncated and empty answers are rejected", async () => {
  for (const candidate of [undefined, { finishReason: "MAX_TOKENS", content: { parts: [{ text: "partial" }] } }, { finishReason: "STOP", content: { parts: [] } }]) {
    await assert.rejects(generateAnswer("Annaly", sources, { apiKey: "test", fetchImpl: async () => ({ ok: true, json: async () => ({ candidates: candidate ? [candidate] : [] }) }) }), { status: 502 });
  }
});
