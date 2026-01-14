// src/index.js
console.log('🚀 MediConnect App Starting...');
console.log('Environment:', import.meta.env.MODE);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

import ErrorBoundary from './components/common/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Root element #root not found in DOM');
}

console.log('✅ Root element found, creating React root...');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('✅ React app mounted successfully');