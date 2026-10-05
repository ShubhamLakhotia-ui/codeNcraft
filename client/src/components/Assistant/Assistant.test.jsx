import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Assistant from "./Assistant";

afterEach(() => { jest.restoreAllMocks(); delete global.fetch; });

test("sends a question and displays the answer with loading feedback", async () => {
  let finish;
  global.fetch = jest.fn(() => new Promise(resolve => { finish = resolve; }));
  render(<Assistant />);
  expect(screen.getByRole("button", { name: /Ask/ })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Your question"), { target: { value: "Annaly experience" } });
  fireEvent.click(screen.getByRole("button", { name: /Ask/ }));
  expect(screen.getByRole("button", { name: /Asking/ })).toBeDisabled();
  expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({ message: "Annaly experience" });
  finish({ ok: true, json: async () => ({ reply: "He built C# APIs at Annaly." }) });
  expect(await screen.findByText("He built C# APIs at Annaly.")).toBeInTheDocument();
});

test("shows quota errors and allows retry", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Usage limit reached." }) });
  render(<Assistant />);
  fireEvent.change(screen.getByLabelText("Your question"), { target: { value: "Skills?" } });
  fireEvent.click(screen.getByRole("button", { name: /Ask/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Usage limit reached.");
  await waitFor(() => expect(screen.getByRole("button", { name: /Ask/ })).toBeEnabled());
});

test("handles an unavailable backend", async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError("Failed to fetch"));
  render(<Assistant />);
  fireEvent.change(screen.getByLabelText("Your question"), { target: { value: "Skills?" } });
  fireEvent.click(screen.getByRole("button", { name: /Ask/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent("assistant is unavailable");
});

test("interview chapter adds topic context and switching clears the answer", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ reply: "Annaly answer", sources: [] }) });
    render(<Assistant />);
    fireEvent.click(screen.getByRole("button", { name: /A problem I solved/ }));
    expect(screen.getByText("From an unusual data point to an explanation.")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("What would you ask next?"), { target: { value: "How did that work?" } });
    fireEvent.click(screen.getByRole("button", { name: "Ask ↗" }));
    expect(await screen.findByText("Annaly answer")).toBeInTheDocument();
    expect(JSON.parse(global.fetch.mock.calls[0][1].body).message).toContain("Topic: Annaly anomaly investigation.");
    fireEvent.click(screen.getByRole("button", { name: /Something I’m building now/ }));
    expect(screen.queryByText("Annaly answer")).not.toBeInTheDocument();
    expect(screen.getByText(/This separate project currently uses demo replies/)).toBeInTheDocument();
});

test("tour only opens a project after the visitor clicks its suggestion", async () => {
  const onShowProject = jest.fn();
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ reply: "Explore the cloud platform.", sources: [{ id: "project-cloud", title: "Cloud platform" }] }) });
  render(<Assistant onShowProject={onShowProject} />);
  fireEvent.change(screen.getByLabelText("Your question"), { target: { value: "Show me AWS work" } });
  fireEvent.click(screen.getByRole("button", { name: "Ask ↗" }));
  const action = await screen.findByRole("button", { name: /Show me Cloud/ });
  expect(onShowProject).not.toHaveBeenCalled();
  fireEvent.click(action);
  expect(onShowProject).toHaveBeenCalledWith("cloud");
});
