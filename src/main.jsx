import React from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import 'lenis/dist/lenis.css';
import App from './App.jsx';
import './styles.css';
import './experience.css';
import './maximalist.css';
import './themes.css';
import './worlds.css';
import './ui-polish.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
