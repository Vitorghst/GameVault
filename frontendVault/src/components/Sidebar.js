import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHome, 
  FaBook, 
  FaSearch, 
  FaHeart, 
  FaFire, 
  FaClock, 
  FaTrophy, 
  FaCog,
  FaSignOutAlt,
  FaGamepad,
  FaPlusCircle,
  FaStar
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Início' },
    { path: '/explorar', icon: <FaSearch />, label: 'Explorar' },
    { path: '/colecao', icon: <FaBook />, label: 'Minha Coleção' },
    { path: '/favoritos', icon: <FaHeart />, label: 'Favoritos' },
    { path: '/jogando', icon: <FaGamepad />, label: 'Jogando' },
    { path: '/zerados', icon: <FaTrophy />, label: 'Zerados' },
    { path: '/quero-jogar', icon: <FaClock />, label: 'Quero Jogar' },
    { path: '/populares', icon: <FaFire />, label: 'Populares' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/dashboard">
          <span className="logo-gradient">🎮 GameCollection</span>
        </Link>
      </div>

      {/* Perfil do usuário */}
      <div className="sidebar-profile">
        <div className="profile-avatar-sidebar">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="profile-info-sidebar">
          <span className="profile-name">{user?.username}</span>
          <span className="profile-email">{user?.email}</span>
        </div>
      </div>

      {/* Menu Principal */}
      <div className="sidebar-menu">
        <div className="menu-section">
          <span className="menu-section-title">MENU</span>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.path === '/dashboard' && (
                <span className="menu-badge">NEW</span>
              )}
            </Link>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div className="menu-section">
          <span className="menu-section-title">AÇÕES</span>
          <button className="menu-item quick-action">
            <FaPlusCircle className="menu-icon" />
            <span className="menu-label">Adicionar Jogo</span>
          </button>
        </div>

        {/* Configurações */}
        <div className="menu-section">
          <span className="menu-section-title">CONFIGURAÇÕES</span>
          <Link to="/configuracoes" className="menu-item">
            <FaCog className="menu-icon" />
            <span className="menu-label">Configurações</span>
          </Link>
          <button onClick={logout} className="menu-item logout-btn-sidebar">
            <FaSignOutAlt className="menu-icon" />
            <span className="menu-label">Sair</span>
          </button>
        </div>
      </div>

      {/* Footer da Sidebar */}
      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <div className="sidebar-stat">
            <span className="stat-value">127</span>
            <span className="stat-label">Jogos</span>
          </div>
          <div className="sidebar-stat">
            <span className="stat-value">1.2k</span>
            <span className="stat-label">Horas</span>
          </div>
          <div className="sidebar-stat">
            <span className="stat-value">45</span>
            <span className="stat-label">Conquistas</span>
          </div>
        </div>
        <div className="sidebar-version">
          v2.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;