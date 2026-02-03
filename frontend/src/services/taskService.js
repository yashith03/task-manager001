// frontend/src/services/taskService.js
import API from "../api/axios";
import { getLocalTasks, saveLocalTasks } from "../storage/tasksStorage";

export const addTask = async (taskData) => {
  const task = {
    ...taskData,
    id: crypto.randomUUID(), // Use UUID for offline compatibility
    completed: taskData.completed || false,
    updatedAt: Date.now(),
    synced: false
  };

  const tasks = getLocalTasks();
  tasks.unshift(task); // Add to beginning
  saveLocalTasks(tasks);

  try {
    const res = await API.post("tasks", {
      text: task.text,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: task.tags
    });

    if (res.status === 200 || res.status === 201) {
      // Update the local task with the backend's response (e.g., getting the real ID)
      // But to keep sync simple, we might just mark as synced.
      // If we use the backend ID, we need to update the local one.
      const savedTask = res.data;
      const updatedTasks = getLocalTasks().map(t => 
        t.id === task.id ? { ...savedTask, synced: true, localId: task.id } : t
      );
      saveLocalTasks(updatedTasks);
      return { ...savedTask, synced: true };
    }
  } catch (err) {
    console.warn("Backend unavailable, task saved locally.");
  }

  return task;
};

export const loadTasks = async () => {
  try {
    const res = await API.get("tasks");
    if (res.status === 200) {
      const backendTasks = res.data.map(t => ({ ...t, synced: true }));
      // Simple merge: backend is source of truth if online
      saveLocalTasks(backendTasks);
      return backendTasks;
    }
  } catch (err) {
    console.warn("Using local tasks (offline mode).");
  }
  return getLocalTasks();
};

export const updateTask = async (id, updatedData) => {
  const tasks = getLocalTasks();
  const taskIndex = tasks.findIndex(t => t.id === id || t.localId === id);
  
  if (taskIndex === -1) return null;

  const updatedTask = { 
    ...tasks[taskIndex], 
    ...updatedData, 
    updatedAt: Date.now(), 
    synced: false 
  };
  
  tasks[taskIndex] = updatedTask;
  saveLocalTasks(tasks);

  try {
    const targetId = tasks[taskIndex].id; // Use the backend ID if available
    const res = await API.put(`tasks/${targetId}`, updatedData);
    if (res.status === 200) {
      updatedTask.synced = true;
      tasks[taskIndex] = { ...res.data, synced: true };
      saveLocalTasks(tasks);
    }
  } catch (err) {
    console.warn("Update failed on backend, saved locally.");
  }

  return updatedTask;
};

export const deleteTask = async (id) => {
  const tasks = getLocalTasks();
  const targetTask = tasks.find(t => t.id === id || t.localId === id);
  
  const filteredTasks = tasks.filter(t => t.id !== id && t.localId !== id);
  saveLocalTasks(filteredTasks);

  if (targetTask && targetTask.synced) {
    try {
      await API.delete(`tasks/${targetTask.id}`);
    } catch (err) {
      console.warn("Delete pending on backend (logic not fully implemented for offline deletes).");
      // In a full implementation, we'd keep a "deletedIds" list to sync later.
    }
  }
};
