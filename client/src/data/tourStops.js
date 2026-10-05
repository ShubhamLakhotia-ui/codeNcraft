import { projectDetails } from "./projects";

// Navigation is derived from retrieved evidence, never from model-generated URLs.
const chapters = {
  "experience-0": { kind: "chapter", id: "annaly", label: "the Annaly problem-solving story" },
  "experience-1": { kind: "chapter", id: "jio", label: "the Jio chapter" },
  "experience-2": { kind: "chapter", id: "jio", label: "the Jio chapter" },
  "project-market-monitor": { kind: "chapter", id: "market-monitor", label: "Market Monitor" },
};

export function getTourStops(sources) {
  const stops = [];
  for (const source of sources) {
    let stop = Object.hasOwn(chapters, source.id) ? chapters[source.id] : null;
    if (!stop && typeof source.id === "string" && source.id.startsWith("project-")) {
      const id = source.id.slice(8);
      if (Object.hasOwn(projectDetails, id)) stop = { kind: "project", id, label: projectDetails[id].name };
    }
    if (stop && !stops.some(item => item.kind === stop.kind && item.id === stop.id)) stops.push(stop);
    if (stops.length === 2) break;
  }
  return stops;
}
