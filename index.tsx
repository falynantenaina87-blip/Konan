import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { ConvexProvider, ConvexReactClient } from "convex/react";

constconst convexUrl = "https://scintillating-leopard-684.convex.cloud";

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
))
