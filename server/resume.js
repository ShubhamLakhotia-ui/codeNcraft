import { readFileSync } from "node:fs";

const sectionLabels = {
  profile: "summary overview",
  experience: "experience work employment",
  education: "education",
  skills: "skill skills toolkit",
  project: "project projects",
};

// Read once at startup. Headings keep each role, project, and skill group together.
export function loadResumePassages() {
  const text = readFileSync(new URL("./data/resume.txt", import.meta.url), "utf8");
  return text.split(/^## /m).slice(1).map((block) => {
    const [heading, ...lines] = block.split("\n");
    const [kind, id, title] = heading.split(" | ");
    const content = lines.join("\n").trim();
    if (!sectionLabels[kind] || !id || !title || !content) {
      throw new Error(`Invalid resume section: ${heading}`);
    }
    return {
      id, title, section: sectionLabels[kind], text: content,
      source: "Shubham_Lakhotia.pdf",
      // The PDF is a backend reference, not a publicly hosted document.
      url: null,
    };
  });
}
