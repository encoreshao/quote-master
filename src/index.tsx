import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './assets/styles/index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
