import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 👈 IMPORT
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardRAWG from './pages/DashboardRAWG';
import Profile from './pages/Profile';
import SearchUsers from './pages/SearchUsers';
import './styles/global.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando sua biblioteca...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// 👇 COMPONENTE QUE ENVOLVE AS ROTAS PRIVADAS COM A NAVBAR
const PrivateLayout = ({ children }) => {
  return (
    <Navbar>
      {children}
    </Navbar>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas - SEM navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rotas privadas - COM navbar */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <DashboardRAWG />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <Profile />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:username"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <Profile />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/search-users"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <SearchUsers />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/explorar"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <DashboardRAWG />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/colecao"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <DashboardRAWG />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/favoritos"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <DashboardRAWG />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/populares"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <DashboardRAWG />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      
      {/* Redirecionamento padrão */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--dark-3)',
              color: 'var(--light-1)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: 'var(--shadow-lg)',
            },
            success: {
              icon: '✅',
              style: {
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
              },
            },
            error: {
              icon: '❌',
              style: {
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
              },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;