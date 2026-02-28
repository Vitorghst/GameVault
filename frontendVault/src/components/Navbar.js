import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiHome, 
  FiBook, 
  FiSearch, 
  FiHeart, 
  FiClock, 
  FiAward,
  FiSettings,
  FiLogOut,
  FiUser,
  FiTrendingUp
} from 'react-icons/fi';
import { SiRepublicofgamers } from "react-icons/si";

const Navbar = ({ children }) => {  // 👈 RECEBE CHILDREN
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Início' },
    { path: '/explorar', icon: <FiSearch />, label: 'Explorar' },
    { path: '/profile', icon: <FiUser />, label: 'Perfil' },
    { path: '/colecao', icon: <FiBook />, label: 'Coleção' },
    { path: '/favoritos', icon: <FiHeart />, label: 'Favoritos' },
    { path: '/populares', icon: <FiTrendingUp />, label: 'Populares' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-with-sidebar">  {/* 👈 CONTAINER PRINCIPAL */}
      
      {/* Overlay para mobile */}
      <div className="sidebar-overlay"></div>
      
      {/* Sidebar */}
      <div className="vertical-navbar">
        {/* Logo */}
        <div className="vertical-navbar-logo">
          <Link to="/dashboard">
            <span className="logo-icon"><SiRepublicofgamers /></span>
            <span className="logo-text">GameVault</span>
          </Link>
        </div>

        {/* Perfil do usuário */}
        <div className="vertical-navbar-profile">
          <div className="profile-avatar">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <span className="profile-name">{user?.username || 'Usuário'}</span>
            <span className="profile-email">{user?.email || 'usuario@email.com'}</span>
          </div>
        </div>

        {/* Menu de navegação */}
        <nav className="vertical-navbar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`vertical-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Configurações e Sair */}
        <div className="vertical-navbar-footer">
          <Link to="/configuracoes" className="vertical-nav-item">
            <FiSettings className="nav-icon" />
            <span className="nav-label">Configurações</span>
          </Link>
          <button onClick={logout} className="vertical-nav-item logout-btn">
            <FiLogOut className="nav-icon" />
            <span className="nav-label">Sair</span>
          </button>
        </div>
      </div>

      {/* Conteúdo principal com margem - RECEBE OS CHILDREN */}
      <div className="main-content-with-sidebar">
        {children}  {/* 👈 É AQUI QUE O CONTEÚDO DAS PÁGINAS APARECE */}
      </div>

    </div>
  );
};

export default Navbar;