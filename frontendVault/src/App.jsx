import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardRAWG from './pages/DashboardRAWG';
import Collection from './pages/Collection';
import GameDetails from './pages/GameDetails';
import Profile from './pages/Profile';
import SearchUsers from './pages/SearchUsers';
import './styles/global.css';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api'
    : 'https://gamevault-backend-kumn.onrender.com/api');

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
    const loadAuthenticatedUser = async (token) => {
      try {
        localStorage.setItem('token', token);
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { 'x-auth-token': token }
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar usuário autenticado (${response.status})`);
        }

        const userData = await response.json();

        if (!userData?.id && !userData?._id) {
          throw new Error('Resposta inválida ao carregar usuário autenticado');
        }

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return true;
      } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        return false;
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      if (window.opener) {
        // Envia para a origem da janela principal (frontend)
        window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS', token }, window.location.origin);
        window.close();
      } else {
        loadAuthenticatedUser(token).then((success) => {
          if (success) {
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/dashboard');
          }
        });
      }
    }
  }, [navigate, setUser]);

  return null;
};

const MessageListener = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const loadAuthenticatedUser = async (token) => {
      try {
        localStorage.setItem('token', token);
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { 'x-auth-token': token }
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar usuário autenticado (${response.status})`);
        }

        const userData = await response.json();

        if (!userData?.id && !userData?._id) {
          throw new Error('Resposta inválida ao carregar usuário autenticado');
        }

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate('/dashboard');
      } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    };

    const handleMessage = (event) => {
      // Verifica se a origem é a mesma do frontend
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
        const token = event.data.token;
        loadAuthenticatedUser(token);
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
          path="/jogo/:igdbId"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <GameDetails />
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
                <Collection />
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
