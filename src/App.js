import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';
import Products from './components/Products/Products';
import Orders from './components/Orders/Orders';
import RoleRoute from './components/RoleRoute';
import SellerDashboard from './components/Dashboard/SellerDashboard';
import DeliveryDashboard from './components/Dashboard/DeliveryDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content" role="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/products" element={<Products />} />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/seller-dashboard" 
                element={
                  <RoleRoute allowedRoles={['SELLER', 'ADMIN']}>
                    <SellerDashboard />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/delivery-tasks" 
                element={
                  <RoleRoute allowedRoles={['DELIVERY_BOY', 'ADMIN']}>
                    <DeliveryDashboard />
                  </RoleRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="app-footer" role="contentinfo">
            <p>&copy; 2026 RecycleMarket. All rights reserved.</p>
            <p>Making recycling rewarding and accessible for everyone.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
