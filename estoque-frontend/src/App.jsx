import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Orders from './pages/Orders.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Sidebar from './components/sidebar.jsx';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;