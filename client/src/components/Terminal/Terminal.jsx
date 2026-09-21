import "./Terminal.css";
import { useState, useEffect } from "react";

function Terminal({ lines, onComplete }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentLetters, setCurrentLetters] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const isDone = currentLine >= lines.length;

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isDone) return;

    const timer = setTimeout(() => {
      if (currentLetters >= lines[currentLine].length) {
        setCurrentLine((line) => line + 1);
        setCurrentLetters(0);
      } else {
        setCurrentLetters((prev) => prev + 1);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [currentLine, currentLetters, lines, isDone]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  useEffect(() => {
    if (!isDone) return;
    const handleKeyPress = () => {
      setIsExiting(true);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isDone]);

  useEffect(() => {
    if (!isExiting) return;
    // Match the one-second fade before handing control back to App.
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [isExiting, onComplete]);

  return (
    <div className={`terminal-container ${isExiting ? "exiting" : ""}`}>
      {lines.map((line, index) => {
        if (index < currentLine) {
          return (
            <p className="terminal-line" key={index}>
              {line}
            </p>
          );
        }

        if (index === currentLine) {
          return (
            <p className="terminal-line" key={index}>
              {line.slice(0, currentLetters)}
              <span className="cursor">{showCursor ? "_" : " "}</span>
            </p>
          );
        }
        return null;
      })}

      {isDone && (
        <button
          className="terminal-line press-any-key"
          onClick={() => setIsExiting(true)}
          disabled={isExiting}
        >
          &gt; Press any key or tap to continue...
        </button>
      )}
    </div>
  );
}

export default Terminal;
