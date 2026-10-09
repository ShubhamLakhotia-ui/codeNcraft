import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  sessionStorage.clear();
  jest.useFakeTimers();
});
afterEach(() => jest.useRealTimers());

test("automatically enters after the readable boot sequence and skips repeat boots in the session", () => {
  const { unmount } = render(<App />);
  expect(screen.getByRole("button", { name: /skip intro/i })).toBeTruthy();
  act(() => jest.advanceTimersByTime(5500));
  act(() => jest.advanceTimersByTime(200));
  expect(screen.getByRole("heading", { name: /I build systems/i })).toBe(document.activeElement);
  unmount();
  render(<App />);
  expect(screen.queryByRole("button", { name: /skip intro/i })).toBeNull();
});

test.each(["keyboard", "button"])("skips immediately using %s", input => {
  render(<App />);
  if (input === "keyboard") fireEvent.keyDown(window, { key: "Enter" });
  else fireEvent.click(screen.getByRole("button", { name: /skip intro/i }));
  expect(screen.getByRole("heading", { name: /I build systems/i })).toBe(document.activeElement);
});

test("reduced motion bypasses the intro", () => {
  const original = window.matchMedia;
  window.matchMedia = () => ({ matches: true });
  try {
    render(<App />);
    expect(screen.queryByRole("button", { name: /skip intro/i })).toBeNull();
    expect(screen.getByRole("heading", { name: /I build systems/i })).toBeTruthy();
  } finally { window.matchMedia = original; }
});

test("switches between About and Home when the address changes", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /skip intro/i }));
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

 test("replays the intro and can pause automatic entry", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /skip intro/i }));
  fireEvent.click(screen.getByRole("button", { name: /replay boot/i }));
  fireEvent.click(screen.getByRole("button", { name: /stay on this screen/i }));
  act(() => jest.advanceTimersByTime(10000));
  expect(screen.getByRole("button", { name: /resume automatic entry/i })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /resume automatic entry/i }));
  act(() => jest.advanceTimersByTime(5500));
  act(() => jest.advanceTimersByTime(200));
  expect(screen.getByRole("heading", { name: /I build systems/i })).toBeTruthy();
 });
