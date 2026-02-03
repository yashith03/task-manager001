//frontend/components/TaskItem.jsx

import React from 'react';


import { useDarkMode } from "./DarkModeContext";
import { motion } from "framer-motion";
import {useState} from "react";

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const { isDarkMode } = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
   if (isEditing && editedText !== task.text) {
      onEdit(task.id, { text: editedText });
    }
    setIsEditing(!isEditing);
  };

  return (
    <motion.div
      layout
      className={`w-full p-4 rounded-xl border-[2.5px] shadow-[3px_3px_0_0_black] transition-all
        ${isDarkMode
          ? task.completed
            ? "bg-gray-600 border-gray-400 text-gray-300 line-through"
            : "bg-gray-700 border-white text-white"
          : task.completed
          ? "bg-gray-200 border-gray-400 text-gray-600 line-through"
          : "bg-white border-black text-black"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
{isEditing ? (
  <input
    type="text"
    value={editedText}
    onChange={(e) => setEditedText(e.target.value)}
    className="w-full px-2 py-1 mt-1 text-black border rounded"
  />
) : (
  <h3 className="text-lg font-bold break-words">{task.text}</h3>
)}
  <p className="text-sm"><strong>Priority:</strong> {task.priority}</p>
  <p className="text-sm"><strong>Due Date:</strong> {task.dueDate || 'N/A'}</p>
  {task.tags && task.tags.length > 0 && (
    <p className="text-sm">
      <strong>Tags:</strong> {task.tags.join(', ')}
    </p>
  )}
</div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`px-3 py-1 rounded-md text-xs font-bold border-[2px] shadow-[2px_2px_0_0_black]
              ${task.completed
                ? isDarkMode
                  ? "bg-green-800 border-white text-white"
                  : "bg-green-300 border-black text-black"
                : isDarkMode
                ? "bg-blue-600 border-white text-white"
                : "bg-yellow-300 border-black text-black"
              }
            `}
          >
            {task.completed ? "Undo" : "Done"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className={`px-2 py-1 rounded-md text-xs border-[2px] font-bold shadow-[2px_2px_0_0_black]
                ${isDarkMode ? "bg-gray-600 border-white text-white" : "bg-blue-100 border-black text-black"}
              `}
            >
              Edit
            </button>

            <button
                onClick={() => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
    }
  }}
              className={`px-2 py-1 rounded-md text-xs border-[2px] font-bold shadow-[2px_2px_0_0_black]
                ${isDarkMode ? "bg-red-600 border-white text-white" : "bg-red-200 border-black text-black"}
              `}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
