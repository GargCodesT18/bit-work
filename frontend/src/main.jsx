/**
 * SupplyGuard React Application Entry Point
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { WorkspaceProvider } from './context/WorkspaceContext.jsx';
import './styles/globals.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <WorkspaceProvider>
          <App />
        </WorkspaceProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
