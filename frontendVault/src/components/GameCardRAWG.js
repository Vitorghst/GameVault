import React from "react";
import { FaClock, FaTrophy, FaStar, FaHeart } from "react-icons/fa";

const GameCardRAWG = ({ game, onClick }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      jogando: "status-jogando",
      zerado: "status-zerado",
      abandonado: "status-abandonado",
      "quero jogar": "status-quero",
      favorito: "status-favorito",
    };
    return statusMap[status] || "";
  };

  // const getStatusIcon = (status) => {
  //   switch(status) {
  //     case 'favorito': return '❤️';
  //     case 'jogando': return '🎮';
  //     case 'zerado': return '✅';
  //     case 'abandonado': return '⏸️';
  //     case 'quero jogar': return '⏳';
  //     default: return '📦';
  //   }
  // };

  const formatHours = (hours) => {
    if (!hours) return "0h";
    return hours >= 24
      ? `${Math.floor(hours / 24)}d ${hours % 24}h`
      : `${hours}h`;
  };

  // Para jogos da busca (sem dados do usuário)
  const isSearchResult = !game._id;

  return (
    <div className="game-card-rawg" onClick={onClick}>
      <div className="game-card-image-container">
        <img
          src={
            game.cover ||
            game.background_image ||
            "https://via.placeholder.com/300x400?text=No+Image"
          }
          alt={game.name}
          className="game-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
          }}
        />

        {/* Overlay com rating */}
        {game.metacritic && (
          <div
            className="game-rating-badge"
            style={{
              background:
                game.metacritic > 75
                  ? "#4caf50"
                  : game.metacritic > 50
                    ? "#ff9800"
                    : "#f44336",
            }}
          >
            {game.metacritic}
          </div>
        )}

        {/* Overlay de status (para coleção) */}
        {!isSearchResult && game.status && (
          <div className={`game-status-badge ${getStatusClass(game.status)}`}>
            {/* <span>{getStatusIcon(game.status)}</span> */}
            {/* <span>{game.status}</span> */}
          </div>
        )}
      </div>

      <div className="game-card-content">
        <h3 className="game-title">{game.name}</h3>

        {/* Informações adicionais da API */}
        {game.released && (
          <div className="game-meta">
            <span className="game-year">
              {new Date(game.released).getFullYear()}
            </span>
            {game.genres && (
              <span className="game-genre">{game.genres[0]?.name}</span>
            )}
          </div>
        )}

        {/* Stats da coleção do usuário */}
        {!isSearchResult && (
          <div className="game-stats-rawg minimal">
            {game.hoursPlayed > 0 && (
              <div className="stat-mini">
                <FaClock className="stat-icon hours-icon" />
                <span>{formatHours(game.hoursPlayed)}</span>
              </div>
            )}
            {game.achievements > 0 && (
              <div className="stat-mini">
                <FaTrophy className="stat-icon trophy-icon" />
                <span>{game.achievements}</span>
              </div>
            )}
            {game.personalRating > 0 && (
              <div className="stat-mini">
                <FaStar className="stat-icon star-icon" />
                <span>{game.personalRating}/5</span>
              </div>
            )}
          </div>
        )}

        {/* Botão de adicionar (para resultados de busca) */}
        {isSearchResult && (
          <button className="suggested-user-follow-btn">
            + Adicionar à coleção
          </button>
        )}
      </div>

      {/* Efeito de hover gradient */}
      <div className="game-card-hover-effect"></div>
    </div>
  );
};

export default GameCardRAWG;
