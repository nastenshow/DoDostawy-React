import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Login from './Pages/Login';
import PrivateRoute from './Pages/components-all/PrivateRoute';
import Dashboard from './Pages/Admin-DoDostawy/Dashboard-Admin';
import Dashboard1 from './Pages/Restaurant-Admin/Dashboard-Admin';


import './App.css'


function App() {
  const [userRoles, setUserRoles] = useState([]);

  // Функція, яка буде передана у контекст і використана у PrivateRoute
  const fetchUserRoles = () => userRoles;

  return (
    <UserProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard-admin/*" element={
              <PrivateRoute allowedRoles={['main-admin']} getUserRoles={fetchUserRoles}>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard-admin-restaurant/*" element={
              <PrivateRoute allowedRoles={['admin-restaurant']} getUserRoles={fetchUserRoles}>
                <Dashboard1 />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
      </UserProvider>
  );
}

export default App;