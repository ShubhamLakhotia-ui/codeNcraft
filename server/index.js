import { loadEnvFile } from "node:process";
import { generateAnswer } from "./llm.js";
import { createServer } from "node:http";
import { retrievePassages } from "./retrieval.js";

// Load the private backend key; hosted environments can supply it directly.
try { loadEnvFile(new URL("./.env", import.meta.url)); }
catch (error) { if (error.code !== "ENOENT") throw error; }

const port = Number(process.env.PORT || 3001);

// Send every API response as JSON so a frontend can read it consistently.
function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

// Decide which response to send based on the requested address and method.
async function handleRequest(request, response) {
  const pathname = new URL(request.url, "http://localhost").pathname;

  if (pathname === "/api/health") {
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      sendJson(response, 405, { error: "Use GET for this endpoint." });
      return;
    }

    sendJson(response, 200, { status: "ok", service: "craftncode-api" });
    return;
  }

  if (pathname === "/api/chat") {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      sendJson(response, 405, { error: "Send a question using POST." });
      return;
    }

    await handleChat(request, response);
    return;
  }

  sendJson(response, 404, { error: "Endpoint not found." });
}

// A request body arrives in pieces. Collect them, then parse the JSON once.
function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;

    request.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > 8192) {
        chunks.length = 0;
        reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      if (bytes > 8192) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("Send valid JSON in the request body."), { status: 400 }));
      }
    });
    request.on("error", reject);
  });
}

// Retrieve evidence first, then ask Gemini to write an answer from it.
async function handleChat(request, response) {
  const contentType = request.headers["content-type"]?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    sendJson(response, 415, { error: "Use Content-Type: application/json." });
    return;
  }

  try {
    const body = await readJsonBody(request);
    if (typeof body?.message !== "string" || !body.message.trim()) {
      sendJson(response, 400, { error: "Provide a non-empty message string." });
      return;
    }

    const message = body.message.trim();
    if (message.length > 1000) {
      sendJson(response, 400, { error: "Keep your message to 1,000 characters or fewer." });
      return;
    }

    const sources = retrievePassages(message);
    sendJson(response, 200, {
      reply: await generateAnswer(message, sources),
      mode: sources.length ? "rag" : "no-match",
      sources,
    });
  } catch (error) {
    sendJson(response, error.status || 500, {
      error: error.status ? error.message : "Could not process the request. Please try again.",
    });
  }
}

const server = createServer(handleRequest);

// Bind locally while we build the API. The React app uses a separate port.
server.listen(port, "127.0.0.1", () => {
  console.log(`API running at http://127.0.0.1:${port}/api/health`);
});
