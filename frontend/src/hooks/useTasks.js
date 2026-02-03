// frontend/src/hooks/useTasks.js
import { useState, useEffect, useCallback } from "react";
import * as taskService from "../services/taskService";
import { syncTasks } from "../services/syncService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const data = await taskService.loadTasks();
    setTasks(data);
    setLoading(false);
    // Try to sync whenever we load
    syncTasks();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    const newTask = await taskService.addTask(taskData);
    setTasks(prev => [newTask, ...prev.filter(t => t.id !== newTask.localId)]);
  };

  const updateTask = async (id, updatedData) => {
    const updatedTask = await taskService.updateTask(id, updatedData);
    if (updatedTask) {
      setTasks(prev => prev.map(t => (t.id === id || t.localId === id) ? updatedTask : t));
    }
  };

  const deleteTask = async (id) => {
    await taskService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id && t.localId !== id));
  };

  return { 
    tasks, 
    loading, 
    addTask, 
    updateTask, 
    deleteTask, 
    refreshTasks: fetchTasks 
  };
};
