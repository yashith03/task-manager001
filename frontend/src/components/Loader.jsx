// frontend/src/components/Loader.jsx

import React from 'react';

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useAnimationFrame, motion, AnimatePresence } from "framer-motion";
import Pencil from "../assets/pencil.png";

const Loader = ({ onFinish }) => {
  const progress = useMotionValue(0);
  const pencilRef = useRef(null);
  const pathRef = useRef(null);
  const startTimeRef = useRef(null);
  const duration = 6000;

  const messages = [
    "Sketching your tasks...",
    "Doodling your daily duties...",
    "Ink-spiring your next steps...",
    "Penciling in your priorities...",
    "Drafting your to-dos...",
    "Outlining your objectives...",
    "Marking up your milestones...",
  ];

  const [currentMessage, setCurrentMessage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  });

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prevMessage) => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useAnimationFrame((t) => {
    if (startTimeRef.current === null) startTimeRef.current = t;
    const elapsed = t - startTimeRef.current;

    let linearProgress = elapsed / duration;
    linearProgress = Math.min(linearProgress, 1);

    let easedValue = easeInOutCubic(linearProgress);

    progress.set(easedValue);

    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    const currentPathDistance = Math.min(length * easedValue, length);

    const point = path.getPointAtLength(currentPathDistance);

    const anglePoint = path.getPointAtLength(Math.min(length, currentPathDistance + 0.1));

    const angle = Math.atan2(anglePoint.y - point.y, anglePoint.x - point.x);

    if (pencilRef.current) {
      const pencilTipRelativeToCenterOffsetX = -9;

      pencilRef.current.setAttribute(
        "style",
        `transform: translate(${point.x + pencilTipRelativeToCenterOffsetX}px, ${point.y - 35}px) rotate(${angle}rad); transform-origin: center;`
      );
    }

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length - currentPathDistance;

    if (linearProgress >= 1 && onFinish) {
      setTimeout(() => onFinish(), 50);
    }
  });

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-black font-comic">
      <div className="border-[3.5px] border-black p-8 w-[90%] max-w-5xl rounded-3xl shadow-[4px_4px_0_0_black] bg-white flex flex-col items-center gap-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute -mb-2 text-2xl tracking-wide"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
        <div className="-mb-2 text-2xl tracking-wide opacity-0 pointer-events-none">
          {messages.reduce((a, b) => (a.length > b.length ? a : b))}
        </div>

        <div className="w-full h-[85px] relative overflow-hidden">
          <svg width="0" height="0">
            <filter id="inkBleed">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </svg>

          <svg
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            className="w-full h-full absolute top-0 left-0 z-0 stroke-gray-300 stroke-[2] fill-none"
          >
            <path
              d="M0,20
                  C50,30 100,10 150,25
                  S250,15 300,28
                  S400,14 450,27
                  S550,13 600,25
                  S700,17 750,22
                  S850,14 900,26
                  S1000,12 1050,28
                  S1150,15 1200,20"
            />
          </svg>

          <svg
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            className="w-full h-full absolute top-0 left-0 z-10 stroke-black stroke-[3.5] fill-none"
            style={{ filter: "url(#inkBleed)" }}
          >
            <path
              ref={pathRef}
              d="M0,20
                  C50,30 100,10 150,25
                  S250,15 300,28
                  S400,14 450,27
                  S550,13 600,25
                  S700,17 750,22
                  S850,14 900,26
                  S1000,12 1050,28
                  S1150,15 1200,20"
            />
          </svg>

          <img
            ref={pencilRef}
            src={Pencil}
            alt="pencil"
            className="absolute top-0 left-0 z-20 object-contain w-8 h-20 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;