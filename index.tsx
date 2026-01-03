import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.error("CRITICAL ERROR: VITE_CONVEX_URL is missing.");
  throw new Error("VITE_CONVEX_URL is not defined. Make sure you have run 'npx convex dev' in a separate terminal.");
}

const convex = new ConvexReactClient(convexUrl);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);