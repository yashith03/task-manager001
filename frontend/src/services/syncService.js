// frontend/src/services/syncService.js
import API from "../api/axios";
import { getLocalTasks, saveLocalTasks } from "../storage/tasksStorage";

export const syncTasks = async () => {
  const tasks = getLocalTasks();
  const unsynced = tasks.filter(t => !t.synced);

  if (unsynced.length === 0) return;

  console.log(`Syncing ${unsynced.length} tasks...`);

  for (const task of unsynced) {
    try {
      // Logic for syncing: if it doesn't have a real backend id, it's a new task
      // This is a simplified sync logic.
      const res = await API.post("tasks", {
        text: task.text,
        priority: task.priority,
        dueDate: task.dueDate,
        tags: task.tags
      });

      if (res.status === 200 || res.status === 201) {
        task.synced = true;
        task.id = res.data.id; // Update with real ID
      }
    } catch (err) {
      console.error("Sync failed for task:", task.text, err);
      break; // Stop syncing if backend is still down
    }
  }

  saveLocalTasks(tasks);
};

// Auto sync when back online
window.addEventListener("online", syncTasks);
