import test from "node:test";
import assert from "node:assert/strict";
import { retrievePassages } from "./retrieval.js";

test("Market Monitor questions retrieve documented architecture and collaborative ownership", () => {
  for (const question of ["What is Market Monitor?", "What did Shubham build in Market Monitor?", "How does Market Monitor use Redis and SSE?"]) {
    const [result] = retrievePassages(question);
    assert.equal(result.id, "project-market-monitor");
    assert.match(result.text, /in collaboration with his manager/);
    assert.match(result.text, /SQL Server/);
    assert.match(result.text, /not order execution/);
    assert.notEqual(result.source, "Shubham_Lakhotia.pdf");
  }
});

test("retrieves AWS evidence including the cloud platform", () => {
  const results = retrievePassages("What has Shubham built with AWS?");
  assert.ok(results.some((item) => item.id === "project-cloud"));
  assert.ok(results.every((item) => item.matchedTerms.includes("aws")));
  assert.ok(results.length <= 3);
});
test("ranks a named project first and preserves its status", () => {
  const [result] = retrievePassages("Tell me about Conversational UI");
  assert.equal(result.id, "project-conversation");
  assert.match(result.text, /Currently building/);
});
test("retrieves education and company details", () => {
  assert.equal(retrievePassages("Northeastern GPA")[0].title, "Northeastern University");
  assert.match(retrievePassages("Annaly")[0].title, /Annaly/);
});
test("does not invent sources for unrelated or empty questions", () => {
  for (const query of ["", "Tell me about", "What is the weather tomorrow?", "What is Shubham favorite food?"]) {
    assert.deepEqual(retrievePassages(query), []);
  }
});
test("preserves specific technology tokens", () => {
  assert.ok(retrievePassages("C#").length > 0);
  assert.deepEqual(retrievePassages("C++"), []);
});


test("broad section questions return the requested kind of information", () => {
  for (const [question, prefix, term] of [
    ["What are your skills?", "skills-", "skills"],
    ["Tell me about your experience", "experience-", "experience"],
    ["What projects have you built?", "project-", "projects"],
    ["What is your education?", "education-", "education"],
    ["Tell me about your work", "experience-", "work"],
  ]) {
    const results = retrievePassages(question);
    assert.ok(results.length > 0, question);
    assert.ok(results.every((item) => item.id.startsWith(prefix)), question);
    assert.ok(results.every((item) => item.matchedTerms.includes(term)), question);
  }
});

test("specific technologies still guide section questions", () => {
  const [result] = retrievePassages("Tell me about your AWS projects");
  assert.equal(result.id, "project-cloud");
  assert.ok(result.matchedTerms.includes("aws"));
});

test("resume roles stay separate and retain their source", () => {
  const [result] = retrievePassages("Tell me about his Annaly work experience");
  assert.equal(result.id, "experience-0");
  assert.equal(result.source, "Shubham_Lakhotia.pdf");
  assert.equal(result.url, null);
  assert.match(result.text, /Isolation Forest/);
  assert.doesNotMatch(result.text, /Jio Platforms/);
});

test("updated resume projects replace older project descriptions", () => {
  const [cloud] = retrievePassages("Cloud-Optimized Content Delivery Platform");
  assert.equal(cloud.id, "project-cloud");
  assert.match(cloud.text, /Step Functions/);
  assert.doesNotMatch(cloud.text, /AI Log Analysis Agent|SendGrid/);
  const [logs] = retrievePassages("AI Log Analysis Agent MCP");
  assert.equal(logs.id, "project-logs");
  assert.match(logs.text, /Model Context Protocol/);
});


test("general introductions retrieve the resume overview", () => {
  for (const question of ["Tell me about shubham", "Who is Shubham Lakhotia?", "Please introduce Shubham."]) {
    const [result] = retrievePassages(question);
    assert.equal(result.id, "profile", question);
    assert.equal(result.source, "Shubham_Lakhotia.pdf");
    assert.match(result.text, /AI Software Engineer/);
  }
  assert.equal(retrievePassages("Tell me about Shubham Annaly experience")[0].id, "experience-0");
});
