// frontend/src/storage/tasksStorage.js
const KEY = "tasks";

export const getLocalTasks = () => {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading from localStorage:", err);
    return [];
  }
};

export const saveLocalTasks = (tasks) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
};
