import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  jest.useFakeTimers();
});
afterEach(() => jest.useRealTimers());

function finishTyping() {
  for (let step = 0; step < 200; step += 1) {
    act(() => jest.advanceTimersByTime(50));
  }
}

test.each(["keyboard", "button"])("opens home after the fade using %s", (input) => {
  render(<App />);
  fireEvent.keyDown(window, { key: "Enter" });
  expect(screen.queryByRole("heading")).toBeNull();
  finishTyping();
  const button = screen.getByRole("button", { name: /continue/i });

  if (input === "keyboard") {
    fireEvent.keyDown(window, { key: "Enter" });
  } else {
    fireEvent.click(button);
  }

  expect(screen.queryByRole("heading")).toBeNull();
  act(() => jest.advanceTimersByTime(1000));
  const heading = screen.getByRole("heading", { name: /I build systems/i });
  expect(document.activeElement).toBe(heading);
  expect(screen.queryByRole("button", { name: /continue/i })).toBeNull();
});

test("switches between About and Home when the address changes", () => {
  render(<App />);
  finishTyping();
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
  act(() => jest.advanceTimersByTime(1000));
  expect(screen.getByRole("link", { name: /meet the builder/i }).getAttribute("href")).toBe("#about");

  act(() => {
    window.history.replaceState(null, "", "/#about");
    window.dispatchEvent(new Event("hashchange"));
  });
  expect(screen.getByRole("heading", { name: /the builder behind/i })).toBe(document.activeElement);
  expect(screen.getByRole("link", { name: "About" }).getAttribute("aria-current")).toBe("page");
  expect(document.title).toBe("About Shubham | codeNcraft");

  act(() => {
    window.history.replaceState(null, "", "/#home");
    window.dispatchEvent(new Event("hashchange"));
  });
  expect(screen.getByRole("heading", { name: /I build systems/i })).toBe(document.activeElement);
  expect(screen.queryByRole("button", { name: /continue/i })).toBeNull();
});
