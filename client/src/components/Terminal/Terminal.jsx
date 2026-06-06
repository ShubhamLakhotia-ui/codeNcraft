import "./Terminal.css";
import { useState, useEffect } from "react";

function Terminal({ lines }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentLetters, setCurrentLetters] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const timer = setInterval(() => {
      setCurrentLetters((prev) => {
        if (prev >= lines[currentLine].length) {
          clearInterval(timer);
          setCurrentLine((line) => line + 1);
          setCurrentLetters(0);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentLine]);

  return (
    <div className="terminal-container">
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
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

export default Terminal;
