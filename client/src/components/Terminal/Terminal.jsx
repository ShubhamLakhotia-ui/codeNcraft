import "./Terminal.css";

function Terminal({ lines }) {
  return (
    <div className="terminal-container">
      {lines.map((line, index) => (
        <p className="terminal-line" key={index}>
          {line}
        </p>
      ))}
    </div>
  );
}

export default Terminal;
