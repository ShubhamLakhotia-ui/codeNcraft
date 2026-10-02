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
