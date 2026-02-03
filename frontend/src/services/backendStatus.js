// frontend/src/services/backendStatus.js
import API from "../api/axios";

export const isBackendOnline = async () => {
  try {
    // We try to fetch tasks with a short timeout to check if backend is reachable
    const res = await API.get("tasks", { timeout: 2000 });
    return res.status === 200;
  } catch (err) {
    return false;
  }
};
