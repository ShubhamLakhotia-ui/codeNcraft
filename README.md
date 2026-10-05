# codeNcraft — Shubham’s portfolio

An interactive portfolio built with React and a Node.js API. Explore projects,
read experience chapters, ask questions grounded in portfolio references, and
follow suggestions to relevant work.

[Live portfolio](https://craftncode-a0507.web.app/) ·
[API health](https://code-ncraft-client.vercel.app/api/health)

## What’s built

- Workspace-style home with command shortcuts and six selectable projects.
- Four interview chapters: an Annaly problem-solving story, Market Monitor,
  Jio experience, and the in-progress Conversational UI project.
- A Gemini assistant backed by keyword retrieval over resume and project data.
- A tour guide that suggests up to two chapters or projects based on retrieved
  references. Navigation happens only when the visitor clicks a suggestion.
- An About page with experience, toolkit, education, interests, email, and LinkedIn.

The tour guide currently uses fixed mappings from references to destinations;
Gemini does not choose or execute navigation tools. The log walkthrough is an
illustrative sample, not a live investigation. The algorithm playground and
field notes are planned features.

## Run locally

Use Node.js 22.12+ with npm. Run commands from the cloned repository directory.
There is no root `package.json`: frontend and backend commands run in their own folders.

### 1. Configure the backend

Copy `server/.env.example` to `server/.env` if you have not already created it:

```env
GEMINI_API_KEY=your_key_here
```

Keep this key on the backend. Never put it in a `REACT_APP_` variable.

In one terminal:

```bash
cd server
npm run dev
```

The backend uses Node’s built-in modules and currently needs no dependency installation.
It listens at `http://127.0.0.1:3001`. Restart it after changing environment variables
or the resume text file.

### 2. Configure the frontend

Create `client/.env.development.local`:

```env
REACT_APP_API_URL=http://127.0.0.1:3001
```

In a second terminal, starting from the repository directory:

```bash
cd client
npm ci
npm start
```

Open `http://localhost:3000`. Restart the frontend whenever its environment
variables change. Stop either server with Ctrl+C in its terminal.

## How a question becomes an answer

```text
Question (plus selected chapter topic, if any)
  → POST /api/chat
  → keyword retrieval selects up to three references
  → Gemini writes an answer using those references
  → React displays the answer, references, and available tour suggestions
  → visitor clicks a suggestion to open a chapter or project
```

No matching references means no Gemini call. Each question starts fresh;
earlier answers are not sent as conversation history. Retrieval uses keyword
matching, not embeddings. References provide context, not verified sentence-level
citations. Questions and matching reference text are sent to Google Gemini.

## Where the code lives

| File or folder | Responsibility |
| --- | --- |
| `client/src/components/Home/` | Workspace commands, selected projects, project navigation |
| `client/src/components/Assistant/` | Question form, chapters, answers, tour controls, styles, tests |
| `client/src/components/About/` | Experience, skills, education, and contact links |
| `client/src/data/interviewStories.js` | Written chapter content and suggested questions |
| `client/src/data/tourStops.js` | Maps retrieved source IDs to allowed navigation destinations |
| `client/src/data/projects.js` | Project descriptions used by the UI and backend retrieval |
| `client/src/data/profile.js` | About-page profile content |
| `server/index.js` | Loads local environment variables and starts the HTTP server |
| `server/app.js` | Routes, CORS, request validation, and JSON responses |
| `server/retrieval.js` | Combines references and ranks keyword matches |
| `server/resume.js` | Reads the prepared resume sections |
| `server/data/resume.txt` | Prepared resume reference text without the contact header |
| `server/data/marketMonitor.js` | Curated Market Monitor reference and collaborative contribution |
| `server/llm.js` | Gemini request, timeout, and provider error handling |
| `api/*.mjs` | Vercel entry points that reuse the shared backend handler |
| `firebase.json` | Frontend build and Firebase Hosting configuration |
| `vercel.json` | Backend deployment configuration |

In `Assistant.jsx`, `selectChapter` clears old results, `clearChapter` returns to
general questions, and `openTourStop` preserves the answer while opening its
recommended destination. `ask` handles the API request.

Updating a PDF does not update RAG automatically. Update the prepared reference
text separately. Interview stories and backend references are also separate;
keep both consistent when changing project facts.

## Checks

From the repository directory:

```bash
npm --prefix server test
CI=true npm --prefix client test -- --watchAll=false
npm --prefix client run build
```

Tests mock the AI provider and do not consume Gemini quota. For a manual tour
check, ask “Show me your AWS projects,” then click the project suggestion.
Ask about Jio or Market Monitor to check chapter navigation.

## Deploy

The frontend is hosted on Firebase; the backend is hosted on Vercel.

### Backend changes → Vercel

From the repository directory, link the existing project once:

```bash
npx vercel link --project code-ncraft-client --scope craft-nc-ode
npx vercel --prod
```

Configure `GEMINI_API_KEY` in Vercel’s Production environment variables.
The production API must be reachable by portfolio visitors without a Vercel login.

### Frontend changes → Firebase

Create `client/.env.production`:

```env
REACT_APP_API_URL=https://code-ncraft-client.vercel.app
```

Then run from the repository directory:

```bash
npx firebase-tools deploy --only hosting --project craftncode-a0507
```

Firebase’s predeploy step builds the frontend automatically. Frontend-only
changes need only Firebase deployment. Backend/reference changes need Vercel;
changes to shared `projects.js` data can affect both. If changing both, deploy
the backend first, then the frontend. Check the live site in a fresh browser session.

## Git and configuration

Commit source code, lockfiles, hosting configuration, and empty environment
examples. Keep `.env*` files (except `.env.example`), API keys, credentials,
`.vercel/`, `.firebase/`, `node_modules/`, and generated builds out of Git.
The Vercel CLI can create a root `.env.local` containing an authentication token;
keep it private. Review `git status` and your diff before committing.

Provider usage limits and billing are managed in their dashboards. The code does
not guarantee zero cost or enforce a spending cap.
