import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { DarkModeProvider, useDarkMode } from "../components/DarkModeContext";

const TestComponent = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <div>
      <span data-testid="dark-mode-status">
        Dark mode is {isDarkMode ? "on" : "off"}
      </span>
      <button onClick={toggleDarkMode}>Toggle</button>
    </div>
  );
};

describe("🌙 DarkModeContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("defaults to light mode", () => {
    render(
      <DarkModeProvider>
        <TestComponent />
      </DarkModeProvider>
    );
    expect(screen.getByTestId("dark-mode-status")).toHaveTextContent("Dark mode is off");
  });

  test("toggles dark mode on and off", () => {
    render(
      <DarkModeProvider>
        <TestComponent />
      </DarkModeProvider>
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle/i });

    // Toggle ON
    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(screen.getByTestId("dark-mode-status")).toHaveTextContent("Dark mode is on");

    // Toggle OFF
    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(screen.getByTestId("dark-mode-status")).toHaveTextContent("Dark mode is off");
  });

  test("loads saved state from localStorage", () => {
    localStorage.setItem("darkMode", "true");

    render(
      <DarkModeProvider>
        <TestComponent />
      </DarkModeProvider>
    );

    expect(screen.getByTestId("dark-mode-status")).toHaveTextContent("Dark mode is on");
  });
});
