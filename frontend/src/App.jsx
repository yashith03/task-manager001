// frontend/src/App.jsx

import { useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDarkMode } from "./components/DarkModeContext";
import Loader from "./components/Loader";
import TaskDashboard from "./components/TaskDashboard";
import Footer from "./components/Footer";
import { motion } from "framer-motion";

const App = () => {
  const location = useLocation();
  const hasShownLoader = useRef(false);
  const shouldShowLoader = location.pathname === "/" && !hasShownLoader.current;
  const [showLoader, setShowLoader] = useState(shouldShowLoader);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleFinishLoading = () => {
    hasShownLoader.current = true;
    setShowLoader(false);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: isDarkMode ? "url('/bg_dark.png')" : "url('/bg.webp')" }}
      />
      {!showLoader && (
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} opacity-90 z-10 pointer-events-none`} />
      )}
      <div className="relative z-20 flex flex-col min-h-screen">
        <motion.button
          onClick={toggleDarkMode}
          className={`fixed top-4 left-4 z-50 p-2 border-[2px] rounded-full text-lg transition-all duration-300 
            ${isDarkMode
              ? 'bg-yellow-300 text-black border-black shadow-[2px_2px_0_0_black]'
              : 'bg-gray-800 text-yellow-300 border-yellow-300 shadow-[2px_2px_0_0_black]'
            }`}
          whileHover={{ scale: 1.1, rotate: 15 }} 
          whileTap={{ scale: 0.9, rotate: -15 }} 
        >
          {isDarkMode ? '🌞' : '🌙'}
        </motion.button>

        {showLoader ? (
          <Loader onFinish={handleFinishLoading} />
        ) : (
          <>
            <main className="flex-grow">
              <Routes>
                <Route path="*" element={<TaskDashboard />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
