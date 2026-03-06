import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import GameCardRAWG from "../components/GameCardRAWG";
import GameModal from "../components/GameModal";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  FaGamepad,
  FaHeart,
  FaClock,
  FaTrophy,
  FaStar,
  FaUserFriends,
  FaCalendarAlt,
  FaEdit,
  FaCog,
} from "react-icons/fa";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [collection, setCollection] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("colecao");
  const [stats, setStats] = useState({
    total: 0,
    jogando: 0,
    zerados: 0,
    favoritos: 0,
    totalHoras: 0,
    totalConquistas: 0,
  });

  const isOwnProfile = !username || username === currentUser?.username;

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      if (username && username !== currentUser?.username) {
        const userRes = await api.get(`/users/${username}`);
        setProfile(userRes.data);
      }

      const endpoint =
        username && username !== currentUser?.username
          ? `/games/collection/${username}`
          : "/games/collection/me";

      const collectionRes = await api.get(endpoint);
      setCollection(collectionRes.data);

      const newStats = collectionRes.data.reduce(
        (acc, game) => {
          acc.total++;
          if (game.status === "jogando") acc.jogando++;
          if (game.status === "zerado") acc.zerados++;
          if (game.status === "favorito") acc.favoritos++;
          acc.totalHoras += game.hoursPlayed || 0;
          acc.totalConquistas += game.achievements || 0;
          return acc;
        },
        {
          total: 0,
          jogando: 0,
          zerados: 0,
          favoritos: 0,
          totalHoras: 0,
          totalConquistas: 0,
        },
      );

      setStats(newStats);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const formatHours = (hours) => {
    if (!hours) return "0h";
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return days > 0 ? `${days}d ${remainingHours}h` : `${hours}h`;
  };

  // Dados de exemplo para atividade recente
  const recentActivity = [
    { id: 1, action: "Zerou", game: "The Witcher 3", date: "2 dias atrás" },
    {
      id: 2,
      action: "Começou a jogar",
      game: "Elden Ring",
      date: "5 dias atrás",
    },
    {
      id: 3,
      action: "Favoritou",
      game: "Red Dead Redemption 2",
      date: "1 semana atrás",
    },
  ];

  // Amigos de exemplo
  const friends = [
    { id: 1, name: "João", avatar: "J", game: "Jogando God of War" },
    { id: 2, name: "Maria", avatar: "M", game: "Zerou Cyberpunk" },
    { id: 3, name: "Pedro", avatar: "P", game: "Jogando Zelda" },
  ];

  return (
    <>
      {/* Hero do Perfil */}
      <div className="profile-hero">
        <div className="profile-hero-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar-large">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="avatar-large-image"
                />
              ) : currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="avatar-large-image"
                />
              ) : (
                profile?.username?.[0]?.toUpperCase() ||
                currentUser?.username?.[0]?.toUpperCase() ||
                "U"
              )}
            </div>
            {isOwnProfile && (
              <button className="profile-edit-btn">
                <span className="edit-icon">
                  <FaEdit />
                </span>
              </button>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">
              {profile?.username || currentUser?.username}
              {isOwnProfile && (
                <span className="profile-badge" style={{ marginLeft: "8px" }}>
                  ⚡ Você
                </span>
              )}
            </h1>
            <p className="profile-bio">{profile?.bio || "Sem bio definida"}</p>

            <div className="profile-meta">
              <div className="profile-meta-item">
                <FaCalendarAlt className="meta-icon" />
                <span>Membro desde 2024</span>
              </div>
              <div className="profile-meta-item">
                <FaUserFriends className="meta-icon" />
                <span>128 amigos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div
            className="profile-stat-icon"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}
          >
            <FaGamepad />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">{stats.total}</span>
            <span className="profile-stat-label">Jogos na coleção</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div
            className="profile-stat-icon"
            style={{ background: "linear-gradient(135deg, #ec4899, #f43f5e)" }}
          >
            <FaHeart />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">{stats.favoritos}</span>
            <span className="profile-stat-label">Favoritos</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div
            className="profile-stat-icon"
            style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}
          >
            <FaClock />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">
              {formatHours(stats.totalHoras)}
            </span>
            <span className="profile-stat-label">Horas jogadas</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div
            className="profile-stat-icon"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            <FaTrophy />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">{stats.totalConquistas}</span>
            <span className="profile-stat-label">Conquistas</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div
            className="profile-stat-icon"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            <FaStar />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">{stats.zerados}</span>
            <span className="profile-stat-label">Zerados</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div
            className="profile-stat-icon"
            style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
          >
            <FaGamepad />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">{stats.jogando}</span>
            <span className="profile-stat-label">Jogando agora</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "colecao" ? "active" : ""}`}
          onClick={() => setActiveTab("colecao")}
        >
          📚 Coleção ({collection.length})
        </button>
        <button
          className={`profile-tab ${activeTab === "atividade" ? "active" : ""}`}
          onClick={() => setActiveTab("atividade")}
        >
          📊 Atividade Recente
        </button>
        <button
          className={`profile-tab ${activeTab === "amigos" ? "active" : ""}`}
          onClick={() => setActiveTab("amigos")}
        >
          👥 Amigos (128)
        </button>
        {/* {isOwnProfile && (
          <button 
            className={`profile-tab ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            ⚙️ Configurações
          </button>
        )} */}
      </div>

      <div className="main-content-rawg">
        {/* Aba de Coleção */}
        {activeTab === "colecao" && (
          <div className="colecao-section">
            <div className="section-header">
              <h2>
                <FaGamepad className="section-title-icon" />
                {isOwnProfile
                  ? "Minha Coleção"
                  : `Coleção de ${profile?.username || currentUser?.username}`}
              </h2>
            </div>

            {collection.length === 0 ? (
              <div className="empty-collection">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                  alt="Empty"
                />
                <h3>Coleção vazia</h3>
                <p>
                  {isOwnProfile
                    ? "Comece adicionando jogos à sua coleção!"
                    : "Este usuário ainda não tem jogos na coleção."}
                </p>
                {isOwnProfile && (
                  <button
                    className="explorar-btn"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    Explorar Jogos
                  </button>
                )}
              </div>
            ) : (
              <div className="games-grid-rawg">
                {collection.map((game) => (
                  <GameCardRAWG
                    key={game._id}
                    game={game}
                    onClick={() => {
                      setSelectedGame(game);
                      setModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba de Atividade Recente */}
        {activeTab === "atividade" && (
          <div className="atividade-section">
            <div className="section-header">
              <h2>
                <FaClock className="section-title-icon" />
                Atividade Recente
              </h2>
            </div>

            <div className="activity-timeline">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.action === "Zerou" && "✅"}
                    {activity.action === "Começou a jogar" && "🎮"}
                    {activity.action === "Favoritou" && "❤️"}
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>{activity.action}</strong> {activity.game}
                    </p>
                    <span className="activity-date">{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba de Amigos */}
        {activeTab === "amigos" && (
          <div className="amigos-section">
            <div className="section-header">
              <h2>
                <FaUserFriends className="section-title-icon" />
                Amigos
              </h2>
            </div>

            <div className="friends-grid">
              {friends.map((friend) => (
                <div key={friend.id} className="friend-card">
                  <div className="friend-avatar">{friend.avatar}</div>
                  <div className="friend-info">
                    <h3>{friend.name}</h3>
                    <p>{friend.game}</p>
                  </div>
                  <button className="friend-message-btn">💬</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba de Configurações (só para o próprio perfil) */}
        {activeTab === "config" && isOwnProfile && (
          <div className="config-section">
            <div className="section-header">
              <h2>
                <FaCog className="section-title-icon" />
                Configurações do Perfil
              </h2>
            </div>

            <div className="config-form">
              <div className="form-group">
                <label>Nome de usuário</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={currentUser?.username}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-input"
                  defaultValue={currentUser?.email}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  className="form-textarea"
                  placeholder="Conte um pouco sobre você..."
                  defaultValue={profile?.bio}
                />
              </div>

              <div className="form-group">
                <label>Avatar</label>
                <div className="avatar-upload">
                  <div className="avatar-preview">
                    {currentUser?.username?.[0]?.toUpperCase()}
                  </div>
                  <button className="avatar-upload-btn">Alterar Avatar</button>
                </div>
              </div>

              <button className="save-profile-btn">Salvar Alterações</button>
            </div>
          </div>
        )}
      </div>

      {isOwnProfile && (
        <GameModal
          game={selectedGame}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={async (gameData) => {
            try {
              await api.put(`/games/${gameData._id}`, gameData);
              setModalOpen(false);
              loadProfile();
            } catch (error) {
              console.error("Erro ao atualizar jogo:", error);
              alert("Erro ao atualizar jogo");
            }
          }}
          onDelete={async (gameId) => {
            try {
              await api.delete(`/games/${gameId}`);
              setModalOpen(false);
              loadProfile();
            } catch (error) {
              console.error("Erro ao deletar jogo:", error);
              alert("Erro ao remover jogo");
            }
          }}
        />
      )}
    </>
  );
};

export default Profile;
