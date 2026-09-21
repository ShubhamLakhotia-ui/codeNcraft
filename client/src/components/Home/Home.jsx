import { useEffect, useRef, useState } from "react";
import "./Home.css";

import { projectDetails } from "../../data/projects";

function Home() {
  const headingRef = useRef(null);
  const projectRef = useRef(null);
  const commandRef = useRef(null);
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("Try a command, or use the launcher. Make yourself at home.");
  const [project, setProject] = useState("logs");
  const [analyzed, setAnalyzed] = useState(false);
  const selected = projectDetails[project];

  useEffect(() => {
    headingRef.current.focus();
  }, []);

  function openProjects() {
    projectRef.current.focus();
    projectRef.current.scrollIntoView?.({ behavior: "auto", block: "nearest" });
  }

  function runCommand(event) {
    event.preventDefault();
    executeCommand(command);
  }

  function executeCommand(input) {
    const value = input.trim().toLowerCase();
    if (!value) return;
    if (value === "about" || value === "experience") {
      window.location.hash = "about";
    } else if (value === "projects") {
      openProjects();
      setMessage("Opened selected projects. Choose a project below to explore its details.");
    } else if (value === "help") {
      setMessage("Available commands: about, experience, projects, help, clear.");
    } else if (value === "clear") {
      setMessage("Terminal cleared. Ready for your next command.");
    } else {
      setMessage(`Unknown command: ${input.trim()}. Type help to see what's available.`);
    }
    setCommand("");
  }

  return (
    <main className="workspace">
      <div className="workspace-path"><span>workspace / home</span><span>SESSION 001 <i aria-hidden="true" /></span></div>
      <div className="workspace-grid">
        <aside className="workspace-sidebar" aria-label="Workspace launcher">
          <p className="workspace-label">EXPLORER</p>
          <a className="launcher-item" href="#about"><span aria-hidden="true">01</span><span>About & experience<small>Meet the builder ↗</small></span></a>
          <button className="launcher-item" onClick={openProjects}><span aria-hidden="true">02</span><span>Selected projects<small>{Object.keys(projectDetails).length} projects to explore ↗</small></span></button>
          <div className="launcher-planned"><span>03</span><span>Playground<small>On the drawing board</small></span></div>
          <div className="launcher-planned"><span>04</span><span>Field notes<small>Coming later</small></span></div>
          <div className="workspace-margin-note"><span aria-hidden="true">↳</span> A portfolio you can<br />poke around in.</div>
        </aside>
        <div className="workspace-content">
          <section className="workspace-intro" aria-labelledby="workspace-heading">
            <p className="workspace-label"><span className="workspace-green">SHUBHAM LAKHOTIA</span> / AI SOFTWARE ENGINEER</p>
            <h1 id="workspace-heading" ref={headingRef} tabIndex={-1}>I build systems.<br /><span>Then make them think.</span></h1>
            <p className="workspace-description">LLM applications, distributed systems, and the interfaces that make them useful. This is my workbench.</p>
            <div className="workspace-credentials"><span>Previously Annaly + Jio</span><span>MS Information Systems · Northeastern</span></div>
          </section>
          <section className="command-window" aria-label="Workspace command bar">
            <div className="window-title"><span><i /><i /><i /></span><span>shubham@workspace: ~</span><button type="button" onClick={() => { setMessage("Available commands: about, experience, projects, help, clear."); commandRef.current.focus(); }}>help</button></div>
            <div className="command-intro">
              <h2>Where would you like to go?</h2>
              <p id="command-instructions">Click a shortcut below, or type <code>about</code>, <code>projects</code>, or <code>help</code> and press Enter.</p>
            </div>
            <label htmlFor="workspace-command" className="command-label">Workspace command</label>
            <form onSubmit={runCommand} className="command-form">
              <span className="workspace-green" aria-hidden="true">❯</span>
              <input id="workspace-command" ref={commandRef} value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Try: projects" aria-describedby="command-instructions" autoComplete="off" spellCheck="false" />
              <button type="submit" aria-label="Run command">Go ↵</button>
            </form>
            <div className="command-shortcuts" role="group" aria-label="Command shortcuts">
              <button onClick={() => executeCommand("about")}><strong>about</strong><span>Meet Shubham ↗</span></button>
              <button onClick={() => executeCommand("projects")}><strong>projects</strong><span>Explore my work ↓</span></button>
              <button onClick={() => { executeCommand("help"); commandRef.current.focus(); }}><strong>help</strong><span>Show all commands</span></button>
            </div>
            <p className="command-response" role="status">{message}</p>
          </section>
          <section className="project-workbench" aria-labelledby="projects-heading">
            <div className="project-section-heading"><h2 id="projects-heading" ref={projectRef} tabIndex={-1}>Selected builds<span> / {String(Object.keys(projectDetails).length).padStart(2, "0")}</span></h2><span className="workspace-label">OPEN A PROJECT ↓</span></div>
            <div className="project-select" role="group" aria-label="Choose a project">
              {Object.entries(projectDetails).map(([id, item], index) => (
                <button key={id} aria-pressed={project === id} onClick={() => setProject(id)}>{String(index + 1).padStart(2, "0")} / {item.label}</button>
              ))}
            </div>
            <div className="project-detail">
              <p className="workspace-label">{selected.category}</p>
              <h3>{selected.name}</h3>
              {selected.status && <p className="project-status">{selected.status}</p>}
              <p className="project-subtitle">{selected.subtitle}</p>
              <p className="project-description">{selected.description}</p>
              <ul className="project-stack">{selected.stack.map((item) => <li key={item}>{item}</li>)}</ul>
              {project === "logs" ? (
                <div className="log-demo">
                  <div className="demo-heading"><span>TRACE WALKTHROUGH</span><span>Illustrative sample · no live AI</span></div>
                  <pre aria-label="Sample application logs"><code>{"14:02:01  WARN   database connection pool at capacity\n14:02:03  ERROR  checkout request timed out\n14:02:04  INFO   retry queued: checkout-42"}</code></pre>
                  <div className="demo-flow" aria-label="Workflow"><span>01 Ingest logs</span><span>→</span><span>02 Retrieve context</span><span>→</span><span>03 Explain</span></div>
                  <button className="demo-button" onClick={() => setAnalyzed((value) => !value)}>{analyzed ? "Reset walkthrough ↺" : "Reveal sample analysis ↗"}</button>
                  <div aria-live="polite">{analyzed && <div className="demo-result"><strong>Hypothesis: connection pool exhaustion</strong><p>The pool warning occurs before the timeout. Check connection usage and slow queries, then verify whether retries increased the load. This sample suggests a cause; it does not confirm one.</p></div>}</div>
                </div>
              ) : project === "hommie" ? (
                <div className="housing-flow"><span className="workspace-label">HOW RECOMMENDATIONS WORK</span><ol><li><strong>Your preferences</strong><span>Rent, commute, safety, and campus proximity.</span></li><li><strong>Two-tower model</strong><span>Compare user and property embeddings.</span></li><li><strong>Personalized shortlist</strong><span>Rank the top matching housing options.</span></li></ol></div>
              ) : (
                <div className="project-highlights">
                  <h4>Inside the project</h4>
                  <ul>{selected.highlights.map((item) => <li key={item.title}><strong>{item.title}</strong><p>{item.detail}</p></li>)}</ul>
                </div>
              )}
            </div>
          </section>
          <div className="workspace-end"><span className="workspace-green">&gt; next_commit</span> Algorithm playground & field notes. Building one piece at a time.</div>
        </div>
      </div>
    </main>
  );
}

export default Home;
