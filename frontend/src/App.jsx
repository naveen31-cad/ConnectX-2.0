import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Make sure the path matches your context file
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Agri from './pages/Agri';
import Healthcare from './pages/Healthcare';
import HomeServices from './pages/HomeServices';
import Other from './pages/OtherTemp';
import DemandAnalytics from './pages/DemandAnalytics';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agri" element={<Agri />} />
          <Route path="/healthcare" element={<Healthcare />} />
          <Route path="/homeservices" element={<HomeServices />} />
          <Route path="/other" element={<Other />} />
          <Route path="/demand-analytics" element={<DemandAnalytics />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}