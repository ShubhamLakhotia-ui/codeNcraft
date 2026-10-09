import "./Terminal.css";
import { useState, useEffect, useRef } from "react";

const LINE_DELAY_MS = 1000;
const AUTO_ENTER_DELAY_MS = 5500;
const FADE_DURATION_MS = 200; // Matches the CSS opacity transition.
const NON_SKIP_KEYS = new Set(["Tab", "Shift", "Control", "Alt", "Meta", "CapsLock"]);

function Terminal({ lines, onComplete }) {
  const skipRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [visibleLines, setVisibleLines] = useState(1);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => { skipRef.current?.focus(); }, []);

  useEffect(() => {
    const timers = lines.slice(1).map((_, index) =>
      setTimeout(() => setVisibleLines(index + 2), (index + 1) * LINE_DELAY_MS));
    return () => timers.forEach(clearTimeout);
  }, [lines]);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setIsExiting(true), AUTO_ENTER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [paused]);

  useEffect(() => {
    const skip = event => {
      if (event.target instanceof Element && event.target.closest("button")) return;
      if (!event.metaKey && !event.ctrlKey && !event.altKey && !NON_SKIP_KEYS.has(event.key)) onComplete();
    };
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const handleMotion = event => { if (event.matches) onComplete(); };
    window.addEventListener("keydown", skip);
    preference?.addEventListener?.("change", handleMotion);
    return () => {
      window.removeEventListener("keydown", skip);
      preference?.removeEventListener?.("change", handleMotion);
    };
  }, [onComplete]);

  useEffect(() => {
    if (!isExiting) return;
    const timer = setTimeout(onComplete, FADE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isExiting, onComplete]);

  function skipIntro(event) {
    event.stopPropagation();
    onComplete();
  }

  function toggleAutoEntry(event) {
    event.stopPropagation();
    setPaused(value => !value);
  }

  return (
    <main className={`terminal-container ${isExiting ? "exiting" : ""}`} onClick={onComplete}>
      <div className="boot-panel">
        <div className="boot-brand"><span aria-hidden="true">✳</span> SHUBHAM OS</div>
        <p className="boot-version">PERSONAL WORKSPACE / v1.0</p>
        <div className="boot-log" aria-hidden="true">
          {lines.slice(0, visibleLines).map(line => <p className="terminal-line" key={line}><span className="boot-ok">[ OK ]</span> {line}</p>)}
          <span className="cursor">_</span>
        </div>
        <p className="boot-status" role="status">Opening your workspace…</p>
        <button ref={skipRef} className="boot-skip" onClick={skipIntro}>Skip intro ↗</button>
        <button className="boot-skip boot-pause" disabled={isExiting} aria-pressed={paused} onClick={toggleAutoEntry}>{paused ? "Resume automatic entry" : "Stay on this screen"}</button>
        <p className="boot-hint">{paused ? "Automatic entry paused · Skip intro when you’re ready" : "Opens automatically · Tap or press a key to skip"}</p>
      </div>
    </main>
  );
}
export default Terminal;
