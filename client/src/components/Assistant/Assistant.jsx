import { useEffect, useRef, useState } from "react";
import "./Assistant.css";

export default function Assistant() {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  async function ask(event) {
    event.preventDefault();
    if (!question.trim() || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setReply("");
    setError("");
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question.trim() }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to answer right now. Please try again.");
      if (typeof data.reply !== "string" || !data.reply.trim()) throw new Error("No answer was returned. Please try again.");
      setReply(data.reply);
    } catch (failure) {
      setError(failure.name === "AbortError"
        ? "The request took too long. Please try again."
        : failure instanceof TypeError || failure instanceof SyntaxError
          ? "The assistant is unavailable. Please try again shortly."
          : failure.message);
    } finally {
      clearTimeout(timeout);
      requestRef.current = null;
      setLoading(false);
    }
  }

  return (
    <section className="portfolio-assistant" aria-labelledby="assistant-heading">
      <p className="workspace-label">ASK SHUBHAM’S PORTFOLIO</p>
      <h2 id="assistant-heading">What would you like to know?</h2>
      <p id="assistant-help">Ask about my experience, skills, or projects. Answers use my resume and portfolio.</p>
      <form onSubmit={ask}>
        <label htmlFor="assistant-question">Your question</label>
        <div className="assistant-input-row">
          <input id="assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} disabled={loading} aria-describedby="assistant-help" placeholder="What did you work on at Annaly?" required />
          <button type="submit" disabled={loading || !question.trim()}>{loading ? "Asking…" : "Ask ↗"}</button>
        </div>
      </form>
      <div role="status" aria-live="polite" className="assistant-response">
        {loading && <p>Looking through my experience and preparing an answer…</p>}
        {reply && <p>{reply}</p>}
      </div>
      {error && <p className="assistant-error" role="alert">{error}</p>}
      <small>AI-generated answers may contain mistakes. Each question starts fresh. Questions and matching reference text are sent to Google Gemini.</small>
    </section>
  );
}
