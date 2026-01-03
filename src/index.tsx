import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importe ton fichier App.tsx
// Si tu as un fichier index.css, décommente la ligne suivante
// import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
