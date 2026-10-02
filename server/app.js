import { generateAnswer } from "./llm.js";
import { retrievePassages } from "./retrieval.js";

// Send every API response as JSON so a frontend can read it consistently.
function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

// Decide which response to send based on the requested address and method.
export default async function handleRequest(request, response) {
  const origin = request.headers.origin;
  const allowedOrigins = new Set([
    "https://craftncode-a0507.web.app", "https://craftncode-a0507.firebaseapp.com",
    "http://localhost:3000",
  ]);
  response.setHeader("Vary", "Origin");
  response.setHeader("Cache-Control", "no-store");
  if (origin && !allowedOrigins.has(origin)) {
    sendJson(response, 403, { error: "Origin not allowed." });
    return;
  }
  if (origin) response.setHeader("Access-Control-Allow-Origin", origin);
  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.writeHead(204);
    response.end();
    return;
  }
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
  // Vercel may parse JSON before invoking the handler; local Node sends a stream.
  if (request.body !== undefined) {
    try {
      const raw = typeof request.body === "string" ? request.body : JSON.stringify(request.body);
      if (Buffer.byteLength(raw) > 8192) {
        return Promise.reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
      }
      return Promise.resolve(JSON.parse(raw));
    } catch {
      return Promise.reject(Object.assign(new Error("Send valid JSON in the request body."), { status: 400 }));
    }
  }
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

