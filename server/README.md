# CraftNCode API — step 4

This folder contains the local Node.js backend. It uses Node's built-in HTTP
module, so there are no packages to install yet.

## Run locally

```bash
cd /Users/shubhamlakhotia/Desktop/CraftNCode/codeNcraft/server
npm run dev
```

Open http://127.0.0.1:3001/api/health to see:

```json
{"status":"ok","service":"craftncode-api"}
```

`index.js` receives requests and sends JSON responses. `package.json` defines
the start commands. `npm run dev` restarts the API when its code changes;
`npm start` runs it without watching.

## Search portfolio information

`POST /api/chat` accepts a JSON body with a `message` string. Unlike the health
check, opening this address in a browser tab will not work: that sends GET.
Run this in another terminal while the server is running:

```bash
curl http://127.0.0.1:3001/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"What has Shubham built with AWS?"}'
```

The response contains `mode: "rag"`, the Gemini answer in `reply`, and up to
three retrieved `sources`. With no matches, it returns `mode: "no-match"` and
a fixed message without calling Gemini. Sources are retrieved context, not
verified sentence-level citations.

`index.js` loads `server/.env` at startup. Set `GEMINI_API_KEY` there; never put
it in frontend code or commit it. `.env.example` is the safe empty template.
`llm.js` sends the question and retrieved text to Gemini 3.1 Flash-Lite using
Node's built-in fetch. It requests answers based only on those references,
limits output to 600 tokens, times out after 20 seconds, and does not retry.
Missing keys, quota limits, and provider failures return sanitized errors.
Keep the Google project on the free tier with billing disabled. The code cannot
enforce your Google billing settings. Requests send reference text to Google.
Restart the API after changing `.env`. Tests use a fake provider and no quota.

`data/resume.txt` contains the extracted resume with its contact header omitted.
Each `## category | id | title` heading marks one complete passage. These headings
were added during preparation; PDF extraction is not run for each question.
`resume.js` reads those sections at startup. `retrieval.js` combines them with
portfolio projects, skipping older portfolio projects whose IDs occur in the resume.
Resume sources have `source: "Shubham_Lakhotia.pdf"` and `url: null` because the
PDF is not publicly hosted. Other projects have `source: "portfolio"`.

`tokenize` removes common conversational words. `retrievePassages` ranks exact
keyword matches, giving extra weight to titles and less-common terms.
This is not semantic search: paraphrases and broad questions may produce no
results or incomplete matches. Restart the API after editing `data/resume.txt`.
Updating the original PDF does not automatically update the extracted text.
The visible About page is unchanged.

Run `npm test` from this folder to check retrieval behavior. Use Node 22.12+
(or a newer supported release) for importing the existing frontend data modules.

In `index.js`, `handleRequest` routes the request, `readJsonBody` reads the
incoming JSON, `handleChat` validates the message and calls retrieval, and `sendJson` sends the result.
Messages must contain 1–1,000 characters after trimming; bodies are limited to
8 KB. Invalid JSON or messages return 400, oversized bodies return 413, wrong
content types return 415, wrong methods return 405, and unknown paths return 404.

The frontend connection and backend deployment will be added
in separate steps. Firebase deployment still publishes only client/build.

## Local question box

`client/src/components/Assistant/Assistant.jsx` manages the question, loading,
answer, and error states. Its stylesheet controls the layout. Home renders this
component only in development until a public backend is configured.
The client package's `proxy` forwards `/api/chat` to `http://127.0.0.1:3001`.
Run `npm run dev` in server and `npm start` in client in separate terminals.
Restart the React development server after changing proxy settings.
The browser never receives the Gemini key. Each submission is independent,
with no conversation history. The UI times out after 30 seconds.
