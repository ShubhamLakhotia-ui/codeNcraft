import { marketMonitorPassages } from "./data/marketMonitor.js";
import { loadResumePassages } from "./resume.js";
import { projectDetails } from "../client/src/data/projects.js";

// Ignore conversational filler. Keep section names such as skills and projects.
const stopWords = new Set("a an the what which who how does did do has have had is are was were be been can could would should tell me about explain describe please shubham lakhotia his he him my your you i with using used use built build and or of on in to for from it".split(" "));

// Keep technology names such as C++, C#, and .NET searchable.
function tokenize(text) {
  return [...new Set((text.toLowerCase().match(/\.?[a-z0-9]+(?:[.+#][a-z0-9+#]*)*/g) || [])
    .filter((word) => !stopWords.has(word)))];
}

// Resume entries replace older portfolio versions with the same project ID.
export function buildPassages() {
  const resumePassages = loadResumePassages();
  const resumeIds = new Set(resumePassages.map((passage) => passage.id));
  return [
    ...resumePassages,
    ...marketMonitorPassages,
    ...Object.entries(projectDetails).filter(([id]) => !resumeIds.has(`project-${id}`)).map(([id, project]) => ({
      id: `project-${id}`, source: "portfolio", section: "project projects", title: project.name, url: "#home",
      text: `${project.name}. ${project.subtitle} ${project.description} Technologies: ${project.stack.join(", ")}. ${project.status ? `Status: ${project.status}. ` : ""}${(project.highlights || []).map((item) => `${item.title}: ${item.detail}`).join(" ")}`,
    })),
  ];
}

const passages = buildPassages().map((passage) => ({
  ...passage,
  // Section labels let broad questions match even if the text omits that word.
  terms: new Set(tokenize(`${passage.section || ""} ${passage.title} ${passage.text}`)),
  titleTerms: new Set(tokenize(passage.title)),
}));

// Basic keyword retrieval, not embeddings or an LLM. Scores only rank matches.
export function retrievePassages(question) {
  let terms = tokenize(question);
  // A name-only introduction loses all its words during filler removal.
  // Route it to the overview, but keep specific questions on normal search.
  // Normalize a common transposition only for the introduction intent check.
  // Keep the full-question match so unrelated questions do not become biographies.
  const introductionQuestion = question.trim().replace(/\s+/g, " ")
    .replace(/\bintorduce\b/gi, "introduce");
  const asksForIntroduction = /^(?:please\s+)?(?:tell me about|who is|describe|introduce)\s+shubham(?:\s+lakhotia)?[.!?]*$/i
    .test(introductionQuestion);
  if (asksForIntroduction) terms = ["overview"];
  if (!terms.length) return [];

  return passages.map((passage) => {
    const matchedTerms = terms.filter((term) => passage.terms.has(term));
    const score = matchedTerms.reduce((total, term) => {
      const frequency = passages.filter((item) => item.terms.has(term)).length;
      return total + Math.log(1 + passages.length / frequency) + (passage.titleTerms.has(term) ? 2 : 0);
    }, 0);
    return { id: passage.id, title: passage.title, source: passage.source, url: passage.url, text: passage.text, matchedTerms, score };
  }).filter((passage) => passage.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 3)
    .map(({ score, ...passage }) => passage);
}
