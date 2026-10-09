import assert from 'node:assert/strict';
import { retrieveHybrid } from '../semantic.js';
process.env.SEMANTIC_SEARCH = 'true';
for (const [question, expected] of [
  ['Show me live financial dashboards', 'project-market-monitor'],
  ['How did you help employees find answers in company documents?', 'experience-1'],
  ['Intorduce shubham', 'profile'],
  ['What is the weather tomorrow?', undefined],
]) {
  const start = performance.now();
  const results = await retrieveHybrid(question);
  assert.equal(results[0]?.id, expected, question);
  console.log(`${question}: ${results[0]?.id || 'no match'} (${Math.round(performance.now()-start)} ms)`);
}
