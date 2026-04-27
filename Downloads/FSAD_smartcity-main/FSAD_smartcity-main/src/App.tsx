import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Infrastructure from './pages/Infrastructure';
import Reports from './pages/Reports';
import Feedback from './pages/Feedback';
import CityInfoPage from './pages/CityInfo';
import Layout from './components/Layout';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'Admin' | 'User' }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="city-info" element={<CityInfoPage />} />
              <Route path="services" element={<Services />} />
              <Route path="infrastructure" element={<Infrastructure />} />
              <Route path="reports" element={<Reports />} />
              <Route path="feedback" element={<Feedback />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
