// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { DarkModeProvider } from './components/DarkModeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <DarkModeProvider>
      <App />
      </DarkModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
