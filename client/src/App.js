import Terminal from "./components/Terminal/Terminal";
import { useCallback, useEffect, useState } from "react";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import "./App.css";

const terminalLines = [
  "Starting workspace…",
  "Mounting projects…",
  "Loading experience: Annaly · Jio",
  "System ready.",
];

function skipBoot() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  try { return sessionStorage.getItem("shubham-os-booted") === "true"; }
  catch { return false; }
}

function App() {
  const [showHome, setShowHome] = useState(skipBoot);
  const completeBoot = useCallback(() => {
    try { sessionStorage.setItem("shubham-os-booted", "true"); } catch { /* Storage may be unavailable. */ }
    setShowHome(true);
  }, []);
  const [page, setPage] = useState(() => window.location.hash === "#about" ? "about" : "home");

  useEffect(() => {
    const updatePage = () => {
      setPage(window.location.hash === "#about" ? "about" : "home");
    };
    window.addEventListener("hashchange", updatePage);
    return () => window.removeEventListener("hashchange", updatePage);
  }, []);

  useEffect(() => {
    document.title = `${showHome && page === "about" ? "About Shubham" : "Shubham OS"} | codeNcraft`;
  }, [page, showHome]);

  return showHome ? (
    <div className="home">
      <header className="home-header">
        <a className="home-brand" href="#home" aria-label="codeNcraft home">codeNcraft<span aria-hidden="true">_</span></a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#home" aria-current={page === "home" ? "page" : undefined}>Home</a>
          <a href="#about" aria-current={page === "about" ? "page" : undefined}>About</a>
        </nav>
        <button className="replay-boot" onClick={() => setShowHome(false)}>Replay boot ↻</button>
        <span className="home-status">Shubham OS / ready</span>
      </header>
      {page === "about" ? <About /> : <Home />}
      <footer className="home-footer">Built from scratch. One commit at a time.</footer>
    </div>
  ) : (
    <Terminal lines={terminalLines} onComplete={completeBoot} />
  );
}
export default App;
