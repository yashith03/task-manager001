import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskList from "../components/TaskList";
import { DarkModeProvider } from "../components/DarkModeContext";

const mockTasks = [
  {
    id: 1,
    title: "Task One",
    text: "Task One",
    completed: false,
    dueDate: "",
    priority: "Low",
    tags: [],
  },
  {
    id: 2,
    title: "Task Two",
    text: "Task Two",
    completed: true,
    dueDate: "",
    priority: "High",
    tags: [],
  },
];

describe("📋 TaskList", () => {
  beforeEach(() => {
    jest.spyOn(window, "confirm").mockImplementation(() => true); // always confirm 'yes'
  });

  afterEach(() => {
    jest.restoreAllMocks(); // clean up
  });

  test("renders list of tasks", () => {
    render(
      <DarkModeProvider>
        <TaskList
          tasks={mockTasks}
          onToggleComplete={() => {}}
          onDelete={() => {}}
          onEdit={() => {}}
          selectedTab="All"
        />
      </DarkModeProvider>
    );

    expect(screen.getByText("Task One")).toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });
test("calls onEdit with correct payload when Save is clicked", async () => {
  const onEditMock = jest.fn();

  render(
    <DarkModeProvider>
      <TaskList
        tasks={mockTasks}
        onToggleComplete={() => {}}
        onDelete={() => {}}
        onEdit={onEditMock}
        selectedTab="All"
      />
    </DarkModeProvider>
  );

  const editButtons = screen.getAllByText("Edit");
  fireEvent.click(editButtons[0]); // enter edit mode

  const input = await screen.findByDisplayValue("Task One");
  fireEvent.change(input, { target: { value: "Updated Task" } });

  // Add delay for state update
  await new Promise((r) => setTimeout(r, 10));

  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  expect(onEditMock).toHaveBeenCalledWith(
    mockTasks[0].id,
    expect.objectContaining({ text: "Updated Task" })
  );
});
});