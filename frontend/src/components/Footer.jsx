// frontend/src/components/Footer.jsx

import React from 'react';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useDarkMode } from '../components/DarkModeContext';
import { motion } from 'framer-motion';



const Footer = () => {
  const { isDarkMode } = useDarkMode();

  const footerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    }
  };

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={footerVariants}
      className={`relative z-10 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} text-center py-10`}
    >
      <div className="max-w-6xl px-4 mx-auto font-comic">
       
        <motion.p
          className={`${isDarkMode ? 'text-white' : 'text-black'} text-sm md:text-base font-light pt-6`}
          variants={itemVariants}
        >
          © {new Date().getFullYear()} Yashith Chandeepa</motion.p>
      </div>
    </motion.footer>
  );
};

export default Footer;