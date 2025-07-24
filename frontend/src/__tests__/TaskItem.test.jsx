import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../components/TaskItem';
import { DarkModeProvider } from '../components/DarkModeContext';

describe("📝 TaskItem", () => {
  const task = {
    id: "1",
    title: "Sample Task",
    completed: false,
    priority: "High",
    dueDate: "2025-07-25",
    tags: ["work"]
  };

  const setup = (overrides = {}) => {
    const onToggleComplete = jest.fn();
    const onDelete = jest.fn();
    const onEdit = jest.fn();

    render(
      <DarkModeProvider>
        <TaskItem
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          {...overrides}
        />
      </DarkModeProvider>
    );

    return { onToggleComplete, onDelete, onEdit };
  };

  test("renders task title and details correctly", () => {
    setup();
    expect(screen.getByText("Sample Task")).toBeInTheDocument();
    expect(screen.getByText(/Priority:/)).toBeInTheDocument();
    expect(screen.getByText(/High/)).toBeInTheDocument();
    expect(screen.getByText(/Due Date:/)).toBeInTheDocument();
    expect(screen.getByText(/2025-07-25/)).toBeInTheDocument();
    expect(screen.getByText(/Tags:/)).toBeInTheDocument();
    expect(screen.getByText(/work/)).toBeInTheDocument();
  });

  test("calls onToggleComplete when Done button is clicked", () => {
    const { onToggleComplete } = setup();
    fireEvent.click(screen.getByText("Done"));
    expect(onToggleComplete).toHaveBeenCalledWith(task.id);
  });

test("calls onDelete after confirmation", () => {
  window.confirm = jest.fn().mockReturnValue(true); // ✅ Fully override confirm
  const { onDelete } = setup();

  fireEvent.click(screen.getByText("Delete"));

  expect(window.confirm).toHaveBeenCalled(); // ✅ Now this will pass
  expect(onDelete).toHaveBeenCalledWith(task.id);
});



  test("enters edit mode and submits updated text", () => {
    const { onEdit } = setup();
    fireEvent.click(screen.getByText("Edit")); // 1st click = edit mode
    const input = screen.getByDisplayValue("Sample Task");
    fireEvent.change(input, { target: { value: "Updated Task" } });
    fireEvent.click(screen.getByText("Edit")); // 2nd click = submit
    expect(onEdit).toHaveBeenCalledWith(task.id, { text: "Updated Task" });
  });

  test("does not call onEdit if text is unchanged", () => {
    const { onEdit } = setup();
    fireEvent.click(screen.getByText("Edit")); // open edit
    const input = screen.getByDisplayValue("Sample Task");
    fireEvent.change(input, { target: { value: "Sample Task" } }); // no actual change
    fireEvent.click(screen.getByText("Edit")); // submit
    expect(onEdit).not.toHaveBeenCalled();
  });
});
