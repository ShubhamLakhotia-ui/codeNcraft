import { warmSemanticSearch } from "./semantic.js";
import { loadEnvFile } from "node:process";
import handleRequest from "./app.js";
import { createServer } from "node:http";

// Load the private backend key; hosted environments can supply it directly.
try { loadEnvFile(new URL("./.env", import.meta.url)); }
catch (error) { if (error.code !== "ENOENT") throw error; }

// Warm the local model before the first question. Hosting keeps keyword search until enabled.
if (process.env.SEMANTIC_SEARCH === "true") {
  try {
    await warmSemanticSearch();
    console.log("Local semantic search ready.");
  } catch {
    console.warn("Embedding model unavailable; keyword search remains available.");
    process.env.SEMANTIC_SEARCH = "false";
  }
}

const port = Number(process.env.PORT || 3001);

const server = createServer(handleRequest);

// Bind locally while we build the API. The React app uses a separate port.
server.listen(port, "127.0.0.1", () => {
  console.log(`API running at http://127.0.0.1:${port}/api/health`);
});
