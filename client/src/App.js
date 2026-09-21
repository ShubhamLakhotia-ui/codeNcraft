import Terminal from "./components/Terminal/Terminal";
import { useEffect, useState } from "react";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import "./App.css";

const terminalLines = [
  "> Initializing Shubham.exe...",
  "> Loading 4 years of experience...",
  "> Compiling skills...",
  "> Connecting to neural network...",
  "> Welcome to Shubham OS",
];

function App() {
  const [showHome, setShowHome] = useState(false);
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
        <span className="home-status">Shubham OS / ready</span>
      </header>
      {page === "about" ? <About /> : <Home />}
      <footer className="home-footer">Built from scratch. One commit at a time.</footer>
    </div>
  ) : (
    <Terminal lines={terminalLines} onComplete={() => setShowHome(true)} />
  );
}
export default App;
