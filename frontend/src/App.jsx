import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import { Login, Signup, SignupWithRole } from './pages/Auth';
import Dashboard from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { NavigationProvider } from './context/NavigationContext.jsx';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <NavigationProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup-with-role" element={<SignupWithRole />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
          </Routes>
        </NavigationProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;