import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  FaSearch, 
  FaUserFriends, 
  FaUserPlus,
  FaGamepad,
  FaClock,
  FaTrophy,
  FaHeart
} from 'react-icons/fa';

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['João', 'Maria', 'Pedro', 'Ana']);
  const [suggestedUsers, setSuggestedUsers] = useState([
    { id: 1, username: 'gamer_pro', bio: '🎮 500+ jogos zerados', online: true },
    { id: 2, username: 'rpg_master', bio: '❤️ Fã de RPGs', online: false },
    { id: 3, username: 'achievement_hunter', bio: '🏆 100% em 50 jogos', online: true },
    { id: 4, username: 'speedrunner', bio: '⏱️ Recordista de Mario', online: false },
    { id: 5, username: 'colecionador', bio: '📚 1000+ jogos na coleção', online: true },
    { id: 6, username: 'platinador', bio: '✨ Platina em todos Souls', online: true },
  ]);
  
  const navigate = useNavigate();

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // Adiciona aos recentes
      if (!recentSearches.includes(searchTerm)) {
        setRecentSearches(prev => [searchTerm, ...prev.slice(0, 4)]);
      }
      
      const response = await api.get(`/users/search?q=${encodeURIComponent(searchTerm)}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro na busca de usuários:', error);
      alert('Erro ao buscar usuários');
    }
    setLoading(false);
  };

  return (
    <>
      
      {/* Hero Search */}
      <div className="search-users-hero">
        <div className="search-users-hero-content">
          <h1 className="search-users-title">
            Conecte-se com <span className="gradient-text">jogadores</span>
          </h1>
          <p className="search-users-subtitle">
            Encontre amigos, compare coleções e compartilhe suas conquistas
          </p>
          
          <div className="search-users-container">
            <FaSearch className="search-users-icon" />
            <input
              type="text"
              className="search-users-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              placeholder="Buscar por nome de usuário..."
            />
            <button 
              className="search-users-button" 
              onClick={searchUsers}
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {/* Recent Searches */}
          <div className="recent-searches">
            <span className="recent-searches-label">Buscas recentes:</span>
            <div className="recent-searches-tags">
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  className="recent-search-tag"
                  onClick={() => {
                    setSearchTerm(term);
                    setTimeout(() => searchUsers(), 100);
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-rawg">
        {/* Resultados da Busca */}
        {users.length > 0 && (
          <div className="content-section">
            <div className="section-header">
              <h2>
                <FaUserFriends className="section-title-icon" />
                Resultados para "{searchTerm}"
              </h2>
              <span className="results-count">{users.length} usuários encontrados</span>
            </div>

            <div className="search-users-grid">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="search-user-card"
                  onClick={() => navigate(`/profile/${user.username}`)}
                >
                  <div className="search-user-avatar">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="search-user-info">
                    <h3 className="search-user-name">{user.username}</h3>
                    {user.bio && <p className="search-user-bio">{user.bio}</p>}
                    
                    {/* Estatísticas de exemplo (depois puxar do backend) */}
                    <div className="search-user-stats">
                      <div className="search-user-stat">
                        <FaGamepad className="stat-icon" />
                        <span>127 jogos</span>
                      </div>
                      <div className="search-user-stat">
                        <FaTrophy className="stat-icon" />
                        <span>45 zerados</span>
                      </div>
                      <div className="search-user-stat">
                        <FaHeart className="stat-icon" />
                        <span>12 favoritos</span>
                      </div>
                    </div>
                  </div>
                  <button className="search-user-add-btn">
                    <FaUserPlus /> Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sugestões de Usuários (quando não há busca) */}
        {users.length === 0 && !searchTerm && (
          <div className="content-section">
            <div className="section-header">
              <h2>
                <FaUserFriends className="section-title-icon" />
                Sugestões para você
              </h2>
              <span className="section-subtitle">Com base nos seus jogos</span>
            </div>

            <div className="suggested-users-grid">
              {suggestedUsers.map((user) => (
                <div
                  key={user.id}
                  className="suggested-user-card"
                  onClick={() => navigate(`/profile/${user.username}`)}
                >
                  <div className="suggested-user-avatar">
                    {user.username[0].toUpperCase()}
                    {user.online && <span className="online-indicator"></span>}
                  </div>
                  <div className="suggested-user-info">
                    <h3 className="suggested-user-name">{user.username}</h3>
                    <p className="suggested-user-bio">{user.bio}</p>
                    
                    {/* Interesses em comum */}
                    <div className="common-interests">
                      <span className="interest-tag">🎮 15 jogos em comum</span>
                      <span className="interest-tag">🏆 8 conquistas</span>
                    </div>
                  </div>
                  <button className="suggested-user-follow-btn">
                    Seguir
                  </button>
                </div>
              ))}
            </div>

            {/* Categorias de busca */}
            <div className="search-categories">
              <h3>Explore por categoria</h3>
              <div className="categories-grid">
                <div className="category-card" onClick={() => setSearchTerm('speedrunner')}>
                  <div className="category-icon">⚡</div>
                  <span>Speedrunners</span>
                </div>
                <div className="category-card" onClick={() => setSearchTerm('platinador')}>
                  <div className="category-icon">🏆</div>
                  <span>Platinadores</span>
                </div>
                <div className="category-card" onClick={() => setSearchTerm('colecionador')}>
                  <div className="category-icon">📚</div>
                  <span>Colecionadores</span>
                </div>
                <div className="category-card" onClick={() => setSearchTerm('rpg')}>
                  <div className="category-icon">⚔️</div>
                  <span>Fãs de RPG</span>
                </div>
                <div className="category-card" onClick={() => setSearchTerm('fps')}>
                  <div className="category-icon">🔫</div>
                  <span>Fãs de FPS</span>
                </div>
                <div className="category-card" onClick={() => setSearchTerm('indie')}>
                  <div className="category-icon">🎨</div>
                  <span>Indie Lovers</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nenhum resultado encontrado */}
        {users.length === 0 && searchTerm && !loading && (
          <div className="empty-search-state">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
              alt="No results" 
              className="empty-search-image"
            />
            <h3>Nenhum usuário encontrado</h3>
            <p>Tente buscar por outro nome ou explorar as sugestões abaixo</p>
            <button 
              className="explorar-btn"
              onClick={() => setSearchTerm('')}
            >
              Ver Sugestões
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchUsers;