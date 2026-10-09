import { buildPassages, retrievePassages } from "./retrieval.js";

const CHUNK_WORDS = 100;
const CHUNK_STRIDE = 80; // 20 words overlap between neighboring chunks.
const MAX_REFERENCES = 3;
const MIN_SIMILARITY = 0.38;
const SEMANTIC_WEIGHT = 1.2;

let indexPromise;

// A single model and reference index are shared across requests in this process.
export function warmSemanticSearch() {
  if (!indexPromise) indexPromise = createIndex().catch(error => {
    indexPromise = null;
    throw error;
  });
  return indexPromise;
}

async function createIndex() {
  const { pipeline, env } = await import("@huggingface/transformers");
  env.cacheDir = new URL("./data/cache/models/", import.meta.url).pathname;
  const encoder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "q8" });
  const embed = async text => Array.from((await encoder(text, { pooling: "mean", normalize: true })).data);
  const passages = buildPassages();
  const chunks = [];
  // Short overlapping windows avoid truncating long role/project descriptions.
  for (const passage of passages) {
    const words = passage.text.split(/\s+/);
    for (let start = 0; start < words.length; start += CHUNK_STRIDE) {
      const text = `${passage.title}. ${words.slice(start, start + CHUNK_WORDS).join(" ")}`;
      chunks.push({ passage, vector: await embed(text) });
    }
  }
  return { embed, chunks };
}

export function rankSemantic(vector, chunks, threshold = MIN_SIMILARITY) {
  const scores = new Map();
  for (const chunk of chunks) {
    const score = vector.reduce((sum, value, i) => sum + value * chunk.vector[i], 0);
    if (score >= threshold && score > (scores.get(chunk.passage.id)?.score ?? -1)) {
      scores.set(chunk.passage.id, { passage: chunk.passage, score });
    }
  }
  return [...scores.values()].sort((a, b) => b.score - a.score).slice(0, MAX_REFERENCES);
}

export async function retrieveHybrid(question) {
  const keywords = retrievePassages(question);
  if (process.env.SEMANTIC_SEARCH !== "true" || !question.trim()) return keywords;
  try {
    const { embed, chunks } = await warmSemanticSearch();
    const semantic = rankSemantic(await embed(question), chunks);
    // Preserve explicit introductions. Otherwise fuse ranks from both searches.
    if (keywords[0]?.id === "profile") return keywords;
    return combineRankings(semantic, keywords);
  } catch {
    console.warn("Semantic search unavailable; using keyword retrieval.");
    return keywords;
  }
}

function combineRankings(semantic, keywords) {
  const combined = new Map();
  for (const [list, weight] of [[semantic.map(item => item.passage), SEMANTIC_WEIGHT], [keywords, 1]]) {
    list.forEach((passage, rank) => {
      const entry = combined.get(passage.id) || { passage, score: 0 };
      entry.score += weight / (rank + 1);
      combined.set(passage.id, entry);
    });
  }
  return [...combined.values()].sort((a, b) => b.score - a.score).slice(0, MAX_REFERENCES).map(item => item.passage);
}
