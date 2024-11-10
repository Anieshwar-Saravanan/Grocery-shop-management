// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);  // Initialize the new root
root.render(<App />);  // Render the App component into this new root
