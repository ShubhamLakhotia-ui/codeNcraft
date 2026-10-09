import test from 'node:test';
import assert from 'node:assert/strict';
import { rankSemantic, retrieveHybrid } from './semantic.js';

test('semantic ranking deduplicates chunks and rejects weak matches', () => {
  const a = {id:'a'}, b = {id:'b'};
  assert.deepEqual(rankSemantic([1,0], [
    {passage:a,vector:[0.8,0.6]}, {passage:a,vector:[1,0]},
    {passage:b,vector:[0,1]},
  ]).map(x=>x.passage.id), ['a']);
});
test('semantic search stays opt-in for hosting and normal unit tests', async () => {
  const old = process.env.SEMANTIC_SEARCH;
  delete process.env.SEMANTIC_SEARCH;
  try { assert.equal((await retrieveHybrid('Intorduce shubham'))[0].id,'profile'); }
  finally { if (old !== undefined) process.env.SEMANTIC_SEARCH = old; }
});
