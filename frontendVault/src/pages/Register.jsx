import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaGamepad, FaGoogle, FaGithub } from 'react-icons/fa';
import CryptoJS from 'crypto-js';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    
    setLoading(true);

     const encryptedPassword = CryptoJS.AES.encrypt(formData.password, SECRET_KEY).toString();
    
    const result = await register(
      formData.username,
      formData.email,
      encryptedPassword
    );
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.error);
    }
    
    setLoading(false);
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

      {/* Card de Registro */}
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <FaGamepad className="auth-logo-icon" />
          <span className="auth-logo-text">GameVault</span>
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Criar conta grátis! 🎮</h1>
          <p className="auth-subtitle">
            Junte-se à comunidade de gamers
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="username">
              <FaUser className="input-icon" />
              Nome de usuário
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Como você quer ser chamado"
                required
                className="auth-input"
              />
              <div className="input-highlight"></div>
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              Email
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          <div className="auth-input-group">
            <label htmlFor="confirmPassword">
              <FaLock className="input-icon" />
              Confirmar Senha
            </label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
              <div className="input-highlight"></div>
            </div>
          </div>

          {/* Termos e condições */}
          <div className="auth-options">
            <label className="checkbox-container">
              <input type="checkbox" required />
              <span className="checkbox-label">
                Eu aceito os <Link to="/terms" className="auth-link">Termos de Uso</Link> e <Link to="/privacy" className="auth-link">Política de Privacidade</Link>
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </button>
        </form>

        {/* Divisor */}
        <div className="auth-divider">
          <span>ou continue com</span>
        </div>

        {/* Social Login */}
        <div className="social-login">
          <button className="social-btn google">
            <FaGoogle /> Google
          </button>
          <button className="social-btn github">
            <FaGithub /> GitHub
          </button>
        </div>

        {/* Link para login */}
        <div className="auth-footer">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="auth-link">
              Fazer login
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

export default Register;