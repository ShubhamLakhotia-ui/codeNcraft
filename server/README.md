# codeNcraft API

Node.js backend shared by local development and Vercel. See the root
[README](../README.md) for full setup, frontend configuration, and deployment.

## Run

Set `GEMINI_API_KEY` in `server/.env` using `.env.example` as a template, then run
`npm run dev` from this folder. `npm start` runs without watching. No backend
packages currently need installing. The local address is `http://127.0.0.1:3001`.

## Routes

- `GET /api/health` returns `{ "status": "ok", "service": "craftncode-api" }`.
- `POST /api/chat` accepts JSON `{ "message": "What did Shubham build at Annaly?" }`.

Chat responses contain `reply`, `mode` (`rag` or `no-match`), and up to three
`sources`. No matches returns a fixed response without calling Gemini.

`index.js` loads local configuration and starts the listener. `app.js` handles
routing, CORS, body parsing, validation, retrieval, and responses. Vercel’s
`api/*.mjs` entry points import that same handler without starting a listener.

Messages must contain 1–1,000 characters after trimming; request bodies are
limited to 8 KB. CORS allows the configured Firebase domains and localhost:3000.
CORS is not authentication or protection against API quota abuse.

## Reference data and generation

`resume.js` loads `data/resume.txt`, whose headings follow
`## category | id | title`. `retrieval.js` combines these sections with the curated
`data/marketMonitor.js` reference and frontend project descriptions. Resume project
entries replace older project entries with matching IDs.

Retrieval removes common filler words and ranks exact keyword matches, with
extra weight for titles and less-common terms. It does not use embeddings.
Updating a source PDF does not automatically update these prepared references.
Restart the backend after changing the resume text.

`llm.js` sends the question and retrieved text to Gemini, requests a grounded
third-person answer, and handles provider errors without exposing diagnostics.
It uses a 20-second provider timeout, limits output to 600 tokens, and does not
retry. Each question is independent. Keys remain on the backend.

The frontend derives tour destinations from returned source IDs. This backend
does not currently implement model-selected navigation tools or an agent loop.

## Test

Run `npm test` in this folder. Tests cover routes, retrieval, validation, and
provider handling with a mocked AI provider; no real Gemini calls are made.

## Local semantic search prototype

Run `npm ci` in `server` to install the embedding runtime. Set
`SEMANTIC_SEARCH=true` in `server/.env` and restart the local API. Startup warms a
quantized MiniLM model, downloaded once from Hugging Face into the ignored
`server/data/cache/models/` directory. Reference chunks are embedded once per
process; questions are embedded locally. No paid embedding API or vector database
is used. Gemini answer generation still uses the existing API quota.

`semantic.js` compares normalized vectors, rejects weak semantic matches, and
combines semantic and keyword ranks. It falls back to keyword search on model
failure. The similarity cutoff is a heuristic, not a confidence guarantee.
Run `node server/scripts/check-semantic.js` from the repository root for real-model
checks without calling Gemini. Ordinary `npm test` does not download the model.

This is enabled locally only. Leave `SEMANTIC_SEARCH` unset on Vercel: native
runtime size, model packaging, writable cache location, and cold starts have not
yet been validated for deployment. Very vague questions can still retrieve poor
matches. Updating reference files requires rebuilding the in-memory index by
restarting the API.
