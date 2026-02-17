import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Vehicles from './components/Vehicles';
import Drivers from './components/Drivers';
import Members from './components/Members';
import TripPlanning from './components/TripPlanning';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = () => {
      const userSession = sessionStorage.getItem('user');
      if (userSession) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route - Login */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <Login setIsAuthenticated={setIsAuthenticated} />
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HomePage onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/vehicles" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Vehicles />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/drivers" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Drivers />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/members" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Members />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/trip-planning" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TripPlanning />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to login if not authenticated, else home */}
          <Route 
            path="*" 
            element={
              isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;