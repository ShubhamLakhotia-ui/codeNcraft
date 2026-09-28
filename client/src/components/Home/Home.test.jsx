import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./Home";

function command(value) {
  const input = screen.getByRole("textbox", { name: /workspace command/i });
  fireEvent.change(input, { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: /run command/i }));
}

afterEach(() => window.history.replaceState(null, "", "/"));

test("supports help, unknown commands, project navigation, and about navigation", () => {
  render(<Home />);
  command("help");
  expect(screen.getByRole("status", { name: "Command result" }).textContent).toContain("Available commands:");
  command("hello");
  expect(screen.getByRole("status", { name: "Command result" }).textContent).toContain("Unknown command: hello");
  command(" PROJECTS ");
  expect(document.activeElement).toBe(screen.getByRole("heading", { name: /selected builds/i }));
  command("about");
  expect(window.location.hash).toBe("#about");
});

test("reveals and resets the sample analysis and switches to Hommie", () => {
  render(<Home />);
  expect(screen.queryByText(/Hypothesis:/)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /reveal sample analysis/i }));
  expect(screen.getByText(/Hypothesis: connection pool exhaustion/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /reset walkthrough/i }));
  expect(screen.queryByText(/Hypothesis:/)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /02 \/ Hommie/i }));
  expect(screen.getByRole("heading", { name: "Hommie" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: /reveal sample analysis/i })).toBeNull();
});

test.each([
  ["03 / GitVisual Learn", "GitVisual Learn"],
  ["04 / MiniOS", "MiniOS"],
])("opens %s without GitHub links", (button, title) => {
  render(<Home />);
  fireEvent.click(screen.getByRole("button", { name: button }));
  expect(screen.getByRole("heading", { name: title })).toBeTruthy();
  expect(screen.queryByRole("link", { name: /github/i })).toBeNull();
  expect(screen.queryByText("HOW RECOMMENDATIONS WORK")).toBeNull();
});
