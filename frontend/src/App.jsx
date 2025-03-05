import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import SignupWithRole from './components/SignupWithRole'; // Import the new component
import { NavigationProvider } from './components/NavigationContext';

function App() {

  return (
    <Router>
      <NavigationProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-with-role" element={<SignupWithRole />} /> {/* Add the new route */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
        </Routes>
      </NavigationProvider>
    </Router>
  );
}

export default App;