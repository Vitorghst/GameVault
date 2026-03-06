import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

// Componente que envolve as rotas privadas com a NAVBAR
const PrivateLayout = ({ children }) => {
  return (
    <Navbar>
      {children}
    </Navbar>
  );
};

// Componente que lida com o token do Google
const GoogleAuthHandler = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      if (window.opener) {
        window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS', token }, 'http://localhost:3001');
        window.close();
      } else {
        localStorage.setItem('token', token);
        
        fetch('http://localhost:3000/api/auth/me', {
          headers: { 'x-auth-token': token }
        })
          .then(res => res.json())
          .then(userData => {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/dashboard');
          })
          .catch(err => console.error('Erro ao buscar usuário:', err));
      }
    }
  }, [navigate, setUser]);

  return null;
};

const MessageListener = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'http://localhost:3001') return;
      
      if (event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
        const token = event.data.token;
        
        localStorage.setItem('token', token);
        
        fetch('http://localhost:3000/api/auth/me', {
          headers: { 'x-auth-token': token }
        })
          .then(res => res.json())
          .then(userData => {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            navigate('/dashboard');
          })
          .catch(err => console.error('Erro ao buscar usuário:', err));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, setUser]);

  return null;
};

function AppRoutes() {
  return (
    <>
      <MessageListener />
      <GoogleAuthHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
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