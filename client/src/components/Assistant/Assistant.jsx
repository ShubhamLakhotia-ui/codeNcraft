import { useEffect, useRef, useState } from "react";
import "./Assistant.css";
import { getTourStops } from "../../data/tourStops";
import { interviewStories } from "../../data/interviewStories";

export default function Assistant({ onShowProject }) {
  const [story, setStory] = useState(null);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [sources, setSources] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  const tourStops = getTourStops(sources);

  function clearAnswer() {
    setReply("");
    setSources([]);
    setError("");
  }

  function selectChapter(chapter) {
    setStory(chapter);
    setQuestion("");
    clearAnswer();
  }

  function clearChapter() {
    selectChapter(null);
  }

  function useSuggestedQuestion() {
    setQuestion(story.question);
    document.getElementById("assistant-question")?.focus();
  }

  function focusChapter() {
    const heading = document.getElementById("interview-story-heading");
    heading?.focus();
    heading?.scrollIntoView?.({ block: "nearest" });
  }

  function openTourStop(stop) {
    if (stop.kind === "project") {
      onShowProject?.(stop.id);
      return;
    }
    const chapter = interviewStories.find(item => item.id === stop.id);
    if (!chapter) return;

    // Keep the answer visible while exploring the chapter it recommended.
    setStory(chapter);
    setQuestion("");
    requestAnimationFrame(focusChapter);
  }

  async function ask(event) {
    event.preventDefault();
    if (!question.trim() || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    clearAnswer();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: story ? `Topic: ${story.topic}. Question: ${question.trim()}` : question.trim() }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "Unable to answer right now. Please try again.",
        );
      if (typeof data.reply !== "string" || !data.reply.trim())
        throw new Error("No answer was returned. Please try again.");
      setReply(data.reply);
      setSources(Array.isArray(data.sources) ? data.sources.filter(source => typeof source.title === "string") : []);
    } catch (failure) {
      setError(
        failure.name === "AbortError"
          ? "The request took too long. Please try again."
          : failure instanceof TypeError || failure instanceof SyntaxError
            ? "The assistant is unavailable. Please try again shortly."
            : failure.message,
      );
    } finally {
      clearTimeout(timeout);
      requestRef.current = null;
      setLoading(false);
    }
  }

  return (
    <section
      className="portfolio-assistant"
      aria-labelledby="assistant-heading"
    >
      <div className="assistant-topline">
        <span className="assistant-eyebrow">INTERACTIVE / PORTFOLIO INTELLIGENCE</span>
        <span className="assistant-badge">RAG + GEMINI</span>
      </div>
      <div className="assistant-intro">
        <span className="assistant-mark" aria-hidden="true">✳</span>
        <div>
          <h2 id="assistant-heading">You’re interviewing me.<br />Where do we start?</h2>
          <p id="assistant-help">Choose a chapter from my work. See the problem, my contribution, and what happened next.</p>
        </div>
      </div>
      <>
        <div className="interview-choices" role="group" aria-label="Choose an interview chapter">
          {interviewStories.map((item, index) => <button key={item.id} type="button" disabled={loading} aria-pressed={story?.id === item.id} onClick={() => selectChapter(item)}>
            <span className="interview-number">0{index + 1}</span><strong>{item.label}</strong><span>{item.context}</span><span aria-hidden="true" className="interview-arrow">↗</span>
          </button>)}
        </div>
        {story && <article className="interview-story" aria-label={story.title}>
          <div className="interview-story-top"><span>{story.context}</span><button disabled={loading} type="button" onClick={clearChapter}>Ask about anything instead</button></div>
          <h3 id="interview-story-heading" tabIndex={-1}>{story.title}</h3>
          <ol>{story.steps.map(([title, text]) => <li key={title}><h4>{title}</h4><p>{text}</p></li>)}</ol>
          {story.question && <button className="interview-followup" disabled={loading} type="button" onClick={useSuggestedQuestion}>{story.question} ↗</button>}
        </article>}
      </>
      <form onSubmit={ask}>
        <label htmlFor="assistant-question">{story ? "What would you ask next?" : "Your question"}</label>
        <div className="assistant-input-row">
          <input
            id="assistant-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={story ? 850 : 1000}
            disabled={loading}
            aria-describedby="assistant-help"
            placeholder={story ? "Ask about this chapter…" : "What did you work on at Annaly?"}
            required
          />
          <button type="submit" disabled={loading || !question.trim()}>
            {loading ? "Asking…" : "Ask ↗"}
          </button>
        </div>
      </form>
      <div role="status" aria-live="polite" className="assistant-response">
        {loading && (
          <p>Looking through my experience and preparing an answer…</p>
        )}
        {reply && <p>{reply}</p>}
      </div>
      {reply && tourStops.length > 0 && (
        <div className="assistant-tour" aria-label="Explore the work behind this answer">
          <h3>See the work behind this answer</h3>
          <p>Choose where to go next.</p>
          {tourStops.map(stop => <button key={stop.id} type="button" disabled={loading} onClick={() => openTourStop(stop)}>Show me {stop.label} <span aria-hidden="true">↗</span></button>)}
        </div>
      )}
      {sources.length > 0 && (
        <div className="assistant-sources">
          <h3>References used</h3>
          <p>Sections supplied to Gemini to help write this answer.</p>
          <ul>{sources.map((source, index) => <li key={`${source.id}-${index}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{source.title}</li>)}</ul>
        </div>
      )}
      <details className="assistant-explainer">
        <summary>How this works</summary>
        <ol><li><strong>You ask</strong><span>A question about my work.</span></li><li><strong>Retrieve</strong><span>Keyword search finds resume and project sections.</span></li><li><strong>Generate</strong><span>Gemini writes an answer using those references.</span></li></ol>
        <p>This is retrieval augmented generation (RAG). If search finds no matches, Gemini is not called. References are context, not verified citations.</p>
      </details>
      {error && (
        <p className="assistant-error" role="alert">
          {error}
        </p>
      )}
      <small>
        AI-generated answers may contain mistakes. {story ? "The selected chapter is included with your question; earlier answers are not." : "Each question starts fresh."}
        Questions and matching reference text are sent to Google Gemini.
      </small>
    </section>
  );
}
