// src/__tests__/TaskForm.test.jsx
import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "../components/TaskForm";
import { DarkModeProvider } from "../components/DarkModeContext"; // ✅ Import context

describe("🧪 TaskForm", () => {
  test("calls onAdd with entered text", () => {
    const mockAddTask = jest.fn();

    render(
      <DarkModeProvider>
        <TaskForm onAdd={mockAddTask} />
      </DarkModeProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Add a new task..."), {
      target: { value: "Test Task" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add/i }));

    expect(mockAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Test Task",
        priority: expect.any(String),
        dueDate: expect.any(String),
        tags: expect.any(Array),
      })
    );
  });
});
