import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import handler from './app.js';

async function call(method, url, body, origin, stream = false) {
  const request = Readable.from(stream ? [Buffer.from(JSON.stringify(body))] : []);
  Object.assign(request, { method, url, headers: { 'content-type': 'application/json', ...(origin ? {origin} : {}) } });
  if (!stream && body !== undefined) request.body = body;
  const response = { headers: {}, setHeader(k,v) { this.headers[k]=v; }, writeHead(status) { this.status=status; }, end(text) { this.data=text ? JSON.parse(text) : null; } };
  await handler(request, response);
  return response;
}
test('health route works without starting a listener', async () => {
  assert.equal((await call('GET','/api/health')).data.status,'ok');
});
test('chat sends full context to Gemini but returns only source IDs and titles', async (t) => {
  const originalKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test-key';
  t.after(() => {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  });
  let providerReferences;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    const payload = JSON.parse(options.body);
    providerReferences = JSON.parse(payload.contents[0].parts[0].text).references;
    return { ok: true, status: 200, json: async () => ({ candidates: [{
      finishReason: 'STOP', content: { parts: [{ text: 'Market Monitor helps traders follow market changes.' }] },
    }] }) };
  });
  for (const stream of [false, true]) {
    const response = await call('POST', '/api/chat', { message: 'Market Monitor' }, undefined, stream);
    assert.equal(response.status, 200);
    assert.equal(response.data.mode, 'rag');
    assert.ok(providerReferences.some(reference => reference.text.includes('Tradeweb')));
    assert.ok(response.data.sources.some(source => source.id === 'project-market-monitor'));
    for (const source of response.data.sources) {
      assert.deepEqual(Object.keys(source).sort(), ['id', 'title']);
      assert.equal(typeof source.title, 'string');
    }
    assert.ok(!JSON.stringify(response.data).includes('Tradeweb'));
  }
});
test('local stream and hosted parsed body both work', async () => {
  for (const stream of [false,true]) {
    const response=await call('POST','/api/chat',{message:'weather tomorrow'},undefined,stream);
    assert.equal(response.status,200);
    assert.equal(response.data.mode,'no-match');
  }
});
test('validates hosted bodies and methods', async () => {
  assert.equal((await call('POST','/api/chat',{})).status,400);
  assert.equal((await call('POST','/api/chat',{message:'a'.repeat(9000)})).status,413);
  assert.equal((await call('GET','/api/chat')).status,405);
});
test('allows Firebase preflight and rejects other browser origins', async () => {
  const response=await call('OPTIONS','/api/chat',undefined,'https://craftncode-a0507.web.app');
  assert.equal(response.status,204);
  assert.equal(response.headers['Access-Control-Allow-Origin'],'https://craftncode-a0507.web.app');
  assert.equal((await call('POST','/api/chat',{},'https://example.com')).status,403);
});
