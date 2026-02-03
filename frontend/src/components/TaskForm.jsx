// frontend/src/components/TaskForm.jsx

import React from 'react';


import { useState } from "react";
import { useDarkMode } from "../components/DarkModeContext";

const TaskForm = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const { isDarkMode } = useDarkMode();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTask = {
      //id: Date.now(),
      text,
      //completed: false,
      priority,
      dueDate,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),  
    };

    onAdd(newTask);
    setText("");
    setPriority("Medium");
    setDueDate("");
    setTags("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full flex flex-col gap-4 border-[2px] p-4 rounded-xl shadow-[4px_4px_0_0_black] ${
        isDarkMode ? "border-white bg-gray-700" : "border-black bg-white"
      }`}
    >
      <input
        type="text"
        placeholder="Add a new task..."
        value={text}
        onChange={(e) => setText(e.target.value)}required
        className={`w-full border-[2px] px-4 py-2 rounded-lg outline-none shadow-[2px_2px_0_0_black] ${
          isDarkMode
            ? "border-white bg-gray-600 text-white placeholder-gray-400"
            : "border-black bg-gray-50 text-gray-700 placeholder-gray-500"
        }`}
      />

      <div className="flex flex-col gap-4 md:flex-row">
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={`h-11 pr-10 border-[2px] px-4 py-2 rounded-lg text-sm appearance-none ${
        isDarkMode
      ? "border-white bg-gray-600 text-white placeholder-gray-400"
      : "border-black bg-gray-50 text-gray-700 placeholder-gray-500"
  }`}
  style={{
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='${isDarkMode ? 'white' : 'black'}' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
    backgroundSize: "1.3rem"
    
  }}
>
  <option value="Low">Low Priority</option>
  <option value="Medium">Medium Priority</option>
  <option value="High">High Priority</option>
</select>


        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`flex-1 border-[2px] px-4 py-2 rounded-lg ${
            isDarkMode
              ? "border-white bg-gray-600 text-white"
              : "border-black bg-gray-50 text-gray-700"
          }`}
        />
      </div>

<input
  type="text"
  placeholder="Add a Description..."
  value={tags}
  onChange={(e) => setTags(e.target.value)}
  className={`w-full border-[2px] px-4 py-2 rounded-lg ${
    isDarkMode
      ? "border-white bg-gray-600 text-white placeholder-gray-400"
      : "border-black bg-gray-50 text-gray-700 placeholder-gray-500"
  }`}
  
  maxLength={70}
  
/>



      <button
        type="submit"
        className={`w-full border-[2px] py-2 px-4 rounded-lg font-bold shadow-[3px_3px_0_0_black] transition-all ${
          isDarkMode
            ? "border-white bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            : "border-black bg-yellow-300 text-black hover:bg-yellow-400 active:bg-yellow-500"
        }`}
      >
        Add Task ➕
      </button>
    </form>
  );
};

export default TaskForm;
