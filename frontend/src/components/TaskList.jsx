// src/components/TaskList.jsx
import React from 'react';


import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../components/DarkModeContext";

const TaskList = ({ tasks, onToggleComplete, onDelete, onEdit }) => {
  const { isDarkMode } = useDarkMode();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [currentEditText, setCurrentEditText] = useState('');
  const [currentEditPriority, setCurrentEditPriority] = useState('Medium');
  const [currentEditDueDate, setCurrentEditDueDate] = useState('');
  const [currentEditTags, setCurrentEditTags] = useState('');
  const editInputRef = useRef(null);

  // Defensive guard against non-array tasks
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

  const getPriorityBgColor = (task) => {
    if (task.completed) return isDarkMode ? "bg-gray-700" : "bg-gray-300";
    const colorMap = {
      Low: isDarkMode ? "bg-blue-800" : "bg-blue-100",
      Medium: isDarkMode ? "bg-yellow-800" : "bg-yellow-100",
      High: isDarkMode ? "bg-red-800" : "bg-red-100",
    };
    return colorMap[task.priority] || (isDarkMode ? "bg-gray-800" : "bg-gray-100");
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setCurrentEditText(task.text);
    setCurrentEditPriority(task.priority);
    setCurrentEditDueDate(task.dueDate || '');
    setCurrentEditTags((task.tags || []).join(', '));
  };

  const handleSaveEdit = (taskId) => {
    if (currentEditText.trim() === '') {
      alert('Task text cannot be empty!');
      return;
    }
    onEdit(taskId, {
      text: currentEditText.trim(),
      priority: currentEditPriority,
      dueDate: currentEditDueDate,
      tags: currentEditTags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    setEditingTaskId(null);
    setCurrentEditText('');
    setCurrentEditTags('');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setCurrentEditText('');
    setCurrentEditTags('');
  };

  const handleDeleteClick = (id, text) => {
    if (!id) return;
    if (window.confirm(`Are you sure you want to delete "${text}"?`)) {
      onDelete(id);
    }
  };

const renderActionButtons = (task) => {
  if (!task?.id) return null;
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onToggleComplete(task.id)}
        className={`text-sm px-2 py-1 border rounded-md transition-all ${
          isDarkMode
            ? task.completed ? "bg-gray-600" : "bg-blue-600"
            : task.completed ? "bg-gray-300" : "bg-white"
        } ${isDarkMode ? "text-white border-white" : "text-black border-black"}`}
      >
        {task.completed ? "Undo" : "Done"}
      </button>

      {/* Only show Edit if task is NOT completed */}
      {!task.completed && (
        <button
          onClick={() => handleEditClick(task)}
          className={`text-sm px-2 py-1 border rounded-md ${
            isDarkMode
              ? "bg-purple-600 text-white border-white"
              : "bg-purple-300 text-black border-black"}`}
        >
          Edit
        </button>
      )}

      <button
        onClick={() => handleDeleteClick(task.id, task.text)}
        className={`text-sm px-2 py-1 border rounded-md ${
          isDarkMode
            ? "bg-red-600 text-white border-white"
            : "bg-red-300 text-black border-black"}`}
      >
        Delete
      </button>
    </div>
  );
};


  const incompleteTasks = safeTasks.filter(t => !t.completed);
  const completedTasks = safeTasks.filter(t => t.completed);

  return (
    <div className="flex flex-col w-full gap-4">
      {safeTasks.length === 0 ? (
        <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No tasks to show.</p>
      ) : (
        <>
          {/* Incomplete Tasks */}
          {incompleteTasks.length > 0 && (
            <>
              <h2 className="mt-4 mb-2 text-lg font-semibold">Active Tasks</h2>
              <AnimatePresence>
                {incompleteTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    className={`w-full border-[2.5px] p-4 rounded-xl shadow-[4px_4px_0_0_black] flex flex-col gap-2 ${getPriorityBgColor(task)}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    {editingTaskId === task.id ? (
                      <div className="flex flex-col gap-2">
                        <input ref={editInputRef} value={currentEditText} onChange={(e) => setCurrentEditText(e.target.value)} className="input" />
                        <select value={currentEditPriority} onChange={(e) => setCurrentEditPriority(e.target.value)} className="input">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                        <input type="date" value={currentEditDueDate} onChange={(e) => setCurrentEditDueDate(e.target.value)} className="input" />
                        <input type="text" value={currentEditTags} onChange={(e) => setCurrentEditTags(e.target.value)} placeholder="Tags" className="input" />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleSaveEdit(task.id)} className="btn-save">Save</button>
                          <button onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-black"} flex items-center gap-2`}>
                            {task.text}
                            {!task.synced && <span title="Local only" className="text-xs cursor-help">🟡</span>}
                            {task.synced && <span title="Synced to cloud" className="text-xs cursor-help">🟢</span>}
                          </h3>
                          {renderActionButtons(task)}
                        </div>
                        <div className={`text-sm flex flex-wrap gap-x-4 gap-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span><strong>Priority:</strong> {task.priority}</span>
                          {task.dueDate && <span><strong>Due:</strong> {formatDateOnly(task.dueDate)}</span>}
                          {task.createdAt && <span><strong>Created:</strong> {formatDateTime(task.createdAt)}</span>}
                          {task.tags?.length > 0 && (
                            <span className="flex items-center gap-2">
                              <strong>Description:</strong>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200">
                                {task.tags.join(', ').length > 90
                                  ? task.tags.join(', ').slice(0, 87) + '...'
                                  : task.tags.join(', ')}
                              </span>
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <>
              <h2 className="mt-6 mb-2 text-lg font-semibold">Completed Tasks</h2>
              <AnimatePresence>
                {completedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    className={`w-full border-[2.5px] p-4 rounded-xl shadow-[4px_4px_0_0_black] flex flex-col gap-2 ${getPriorityBgColor(task)}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg italic font-semibold text-gray-600 line-through flex items-center gap-2">
                        {task.text}
                        {!task.synced && <span title="Local only" className="text-xs cursor-help grayscale">🟡</span>}
                        {task.synced && <span title="Synced to cloud" className="text-xs cursor-help grayscale">🟢</span>}
                      </h3>
                      {renderActionButtons(task)}
                    </div>
                     <div className={`text-sm flex flex-wrap gap-x-4 gap-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      <span><strong>Priority:</strong> {task.priority}</span>
      {task.dueDate && <span><strong>Due:</strong> {formatDateOnly(task.dueDate)}</span>}
      {task.createdAt && <span><strong>Created:</strong> {formatDateTime(task.createdAt)}</span>}
      {task.tags?.length > 0 && (
        <span className="flex items-center gap-2">
          <strong>Description:</strong>
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200">
            {task.tags.join(', ').length > 90
              ? task.tags.join(', ').slice(0, 87) + '...'
              : task.tags.join(', ')}
          </span>
        </span>
      )}
    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
