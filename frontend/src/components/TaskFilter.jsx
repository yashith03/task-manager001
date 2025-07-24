//src/components/TaskFilter.jsx
import React from 'react';


const TaskFilter = ({ filter, setFilter }) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {["All", "Active", "Completed"].map((type) => (
        <button
          key={type}
          onClick={() => setFilter(type)}
          className={`px-5 py-2 rounded-xl border-[2px] border-black shadow-[2px_2px_0_0_black] font-comic transition-all ${
            filter === type
              ? "bg-blue-300 text-black"
              : "bg-white text-gray-700 hover:bg-gray-200"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
