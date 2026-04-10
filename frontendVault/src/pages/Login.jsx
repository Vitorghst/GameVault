import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import GameVaultLogo from '../components/GameVaultLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const result = await login(email, password);

  if (result.success) {
    navigate('/dashboard');
  } else {
    alert(result.error);
  }

  setLoading(false);
};

  const handleGoogleLogin = () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      'https://gamevault-backend-kumn.onrender.com/api/auth/google',
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  return (
    <div className="auth-container">
      {/* Background com efeito */}
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="auth-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
      </div>

      

      {/* Card de Login */}
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <GameVaultLogo />
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Bem-vindo de volta! 👋</h1>
          <p className="auth-subtitle">
            Entre para continuar sua jornada nos games
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              Email
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="auth-input"
              />
              <div className="input-highlight"></div>
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Senha
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
              <div className="input-highlight"></div>
            </div>
          </div>

          <div className="auth-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkbox-label">Lembrar-me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Divisor */}
        <div className="auth-divider">
          <span>ou continue com</span>
        </div>

        {/* Social Login */}
        <div className="social-login">
          <button 
            onClick={handleGoogleLogin} 
            className="social-btn google"
          >
            <FaGoogle /> Google
          </button>
          <button className="social-btn github">
            <FaGithub /> GitHub
          </button>
        </div>

        {/* Link para registro */}
        <div className="auth-footer">
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" className="auth-link">
              Criar conta grátis
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">🎮</span>
            <span>+400k jogos</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🏆</span>
            <span>Conquistas</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👥</span>
            <span>Comunidade</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
