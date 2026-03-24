import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css'; // Removed to avoid conflicts
// import './theme.css'; // Removed to avoid conflicts
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './context/CartContext';
import axios from 'axios';
axios.defaults.baseURL = 'https://travel-website-hfqu.onrender.com';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <CartProvider>
        <App />
      </CartProvider>
    </Router>
  </React.StrictMode>
);
