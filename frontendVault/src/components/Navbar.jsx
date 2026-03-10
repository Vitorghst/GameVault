import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
  FiTrendingUp,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { SiRepublicofgamers } from "react-icons/si";

const Navbar = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard", icon: <FiHome />, label: "Início" },
    { path: "/explorar", icon: <FiSearch />, label: "Explorar" },
    { path: "/profile", icon: <FiUser />, label: "Perfil" },
    { path: "/colecao", icon: <FiBook />, label: "Coleção" },
    { path: "/favoritos", icon: <FiHeart />, label: "Favoritos" },
    { path: "/populares", icon: <FiTrendingUp />, label: "Populares" },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="app-with-sidebar" style={{ position: "relative" }}>
      {/* Botão do menu hambúrguer (só aparece no mobile) */}
      <button className="mobile-menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Overlay para mobile */}
      <div
        className={`sidebar-overlay ${menuOpen ? "active" : ""}`}
        onClick={closeMenu}
      ></div>

      {/* Sidebar */}
      <div className={`vertical-navbar ${menuOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="vertical-navbar-logo">
          <Link to="/dashboard" onClick={closeMenu}>
            <span className="logo-icon">
              <SiRepublicofgamers />
            </span>
            <span className="logo-text">GameVault</span>
          </Link>
        </div>

        {/* Perfil do usuário */}
        <div className="vertical-navbar-profile">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="avatar-image"
              />
            ) : (
              user?.username?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <div className="profile-info">
            <span className="profile-name">{user?.username || "Usuário"}</span>
            <span className="profile-email">
              {user?.email || "usuario@email.com"}
            </span>
          </div>
        </div>

        {/* Menu de navegação */}
        <nav className="vertical-navbar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`vertical-nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Configurações e Sair */}
        <div className="vertical-navbar-footer">
          <Link
            to="/configuracoes"
            className="vertical-nav-item"
            onClick={closeMenu}
          >
            <FiSettings className="nav-icon" />
            <span className="nav-label">Configurações</span>
          </Link>
          <button onClick={logout} className="vertical-nav-item logout-btn">
            <FiLogOut className="nav-icon" />
            <span className="nav-label">Sair</span>
          </button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content-with-sidebar">{children}</div>
    </div>
  );
};

export default Navbar;
