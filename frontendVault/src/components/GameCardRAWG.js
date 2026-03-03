import React from "react";
import toast from 'react-hot-toast';
import { showConfirm } from '../utils/confirmDialog';
import { FaClock, FaTrophy, FaStar, FaHeart, FaTrash } from "react-icons/fa";
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
  FaGlobe,
} from "react-icons/fa";
import { SiNintendoswitch, SiMacos } from "react-icons/si";

const GameCardRAWG = ({ game, onClick, onDelete }) => {
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

  const formatHours = (hours) => {
    if (!hours) return "0h";
    return hours >= 24
      ? `${Math.floor(hours / 24)}d ${hours % 24}h`
      : `${hours}h`;
  };

  const isSearchResult = !game._id;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    
    // 👇 USA A CONFIRMAÇÃO PERSONALIZADA
    showConfirm(`Remover "${game.name}" da sua coleção?`, async () => {
      try {
        await onDelete(game._id);
        toast.success('Jogo removido com sucesso!', {
          className: 'toast-success',
          duration: 3000,
        });
      } catch (error) {
        toast.error('Erro ao remover jogo', {
          className: 'toast-error',
        });
      }
    });
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    toast.success('✨ Jogo adicionado à coleção!', {
      className: 'toast-success',
      duration: 3000,
    });
    // Aqui você chama a função de adicionar
  };

  return (
    <div className="game-card-rawg" onClick={onClick}>
      
      {/* LIXEIRA NO CANTO SUPERIOR DIREITO (SÓ NA COLEÇÃO) */}
      {!isSearchResult && (
        <button 
          className="card-delete-btn"
          onClick={handleDeleteClick}
          title="Remover da coleção"
        >
          <FaTrash />
        </button>
      )}

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

        {game.platforms && game.platforms.length > 0 && (
          <div className="game-platforms">
            {game.platforms.slice(0, 4).map((platform) => {
              const getPlatformIcon = (id) => {
                switch (id) {
                  case 6: return <FaWindows />;
                  case 48:
                  case 167:
                  case 7:
                  case 8:
                  case 9: return <FaPlaystation />;
                  case 49:
                  case 169:
                  case 12:
                  case 11: return <FaXbox />;
                  case 130:
                  case 4:
                  case 41:
                  case 5: return <SiNintendoswitch />;
                  case 14: return <SiMacos />;
                  case 39: return <FaApple />;
                  case 3: return <FaLinux />;
                  case 34: return <FaAndroid />;
                  case 82: return <FaGlobe />;
                  default: return null;
                }
              };

              const icon = getPlatformIcon(platform.id);

              return icon ? (
                <div
                  key={platform.id}
                  className="platform-icon"
                  title={platform.name}
                >
                  {icon}
                </div>
              ) : null;
            })}
            {game.platforms.length > 4 && (
              <span className="platform-more">
                +{game.platforms.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Botão de adicionar (para resultados de busca) */}
        {isSearchResult &&
          game.first_release_date &&
          game.first_release_date * 1000 < Date.now() && (
            <button 
              className="suggested-user-follow-btn"
              onClick={handleAddClick}
            >
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