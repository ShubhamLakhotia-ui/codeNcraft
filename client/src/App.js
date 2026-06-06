import Terminal from "./components/Terminal/Terminal";

const terminalLines = [
  "> Initializing Shubham.exe...",
  "> Loading 4 years of experience...",
  "> Compiling skills...",
  "> Connecting to neural network...",
  "> Welcome to Shubham OS",
];

function App() {
  return (
    <div>
      <Terminal lines={terminalLines} />
    </div>
  );
}
export default App;
