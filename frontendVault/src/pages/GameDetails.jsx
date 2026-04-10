import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaCalendarAlt,
  FaClock,
  FaGamepad,
  FaHeart,
  FaPen,
  FaPlus,
  FaPlay,
  FaStar,
  FaTrash,
  FaTrophy,
} from "react-icons/fa";
import api from "../services/api";
import GameModal from "../components/GameModal";

const GameDetails = () => {
  const { igdbId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [game, setGame] = useState(location.state?.game || null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingToCollection, setSavingToCollection] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const response = await api.get(`/games/details/${igdbId}`);
        setGame((previousGame) => ({
          ...previousGame,
          ...response.data,
          cover:
            response.data.cover?.url?.replace("t_thumb", "t_cover_big") ||
            previousGame?.cover ||
            null,
        }));
      } catch (error) {
        console.error("Erro ao carregar detalhes do jogo:", error);
        setLoadError(
          error.response?.data?.message || "Nao foi possivel carregar todos os detalhes do jogo.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadGameDetails();
  }, [igdbId]);

  if (loading) {
    return (
      <div className="game-details-page">
        <div className="game-details-loading">Carregando detalhes do jogo...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-details-page">
        <div className="game-details-empty">
          <h2>Jogo não encontrado</h2>
          <button className="game-details-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Voltar
          </button>
        </div>
      </div>
    );
  }

  const trailerId = game.videos?.[0]?.video_id || game.youtubeTrailerId;
  const mediaGallery = [
    ...(game.screenshots || []).slice(0, 4),
    ...(game.artworks || []).slice(0, 2),
  ];
  const releaseYear = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : "Sem data";
  const criticScore = game.aggregated_rating
    ? Math.round(game.aggregated_rating)
    : game.total_rating
      ? Math.round(game.total_rating)
      : null;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${game.name} trailer`,
  )}`;
  const isInCollection = Boolean(game.collectionGame?._id);

  const handleAddToCollection = async () => {
    if (isInCollection || savingToCollection) {
      return;
    }

    try {
      setSavingToCollection(true);
      const response = await api.post("/games/add", {
        igdbId: Number(igdbId),
        name: game.name,
        cover:
          game.cover?.url?.replace("t_thumb", "t_cover_big") ||
          game.cover ||
          "",
        platforms: game.platforms || [],
        status: "quero jogar",
        hoursPlayed: 0,
        achievements: 0,
        personalRating: 0,
        notes: "",
      });

      setGame((previousGame) => ({
        ...previousGame,
        collectionGame: response.data,
      }));
    } catch (error) {
      console.error("Erro ao adicionar jogo à coleção:", error);
      alert(error.response?.data?.message || "Erro ao adicionar jogo à coleção");
    } finally {
      setSavingToCollection(false);
    }
  };

  const handleEditCollection = () => {
    if (!isInCollection) {
      return;
    }

    setModalOpen(true);
  };

  const handleSaveCollectionGame = async (gameData) => {
    try {
      const response = await api.put(`/games/${gameData._id}`, {
        status: gameData.status,
        hoursPlayed: gameData.hoursPlayed,
        achievements: gameData.achievements,
        personalRating: gameData.personalRating,
        notes: gameData.notes,
      });

      setGame((previousGame) => ({
        ...previousGame,
        collectionGame: response.data,
      }));
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar jogo da coleção:", error);
      alert(error.response?.data?.message || "Erro ao atualizar jogo");
    }
  };

  const handleDeleteCollectionGame = async (gameId) => {
    try {
      await api.delete(`/games/${gameId}`);
      setGame((previousGame) => ({
        ...previousGame,
        collectionGame: null,
      }));
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao remover jogo da coleção:", error);
      alert(error.response?.data?.message || "Erro ao remover jogo");
    }
  };

  const handleRemoveFromCollection = () => {
    if (!game.collectionGame?._id) {
      return;
    }

    const confirmed = window.confirm(`Remover "${game.name}" da sua coleção?`);
    if (!confirmed) {
      return;
    }

    handleDeleteCollectionGame(game.collectionGame._id);
  };

  return (
    <div className="game-details-page">
      <div className="game-details-hero">
        <button className="game-details-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Voltar
        </button>

        <div className="game-details-hero-grid">
          <div className="game-details-cover-wrap">
            <img
              src={
                game.cover?.url?.replace("t_thumb", "t_cover_big") ||
                game.cover ||
                "https://via.placeholder.com/400x520?text=No+Image"
              }
              alt={game.name}
              className="game-details-cover"
            />
          </div>

          <div className="game-details-main">
            <div className="game-details-header">
              <div>
                <p className="game-details-kicker">Ficha do jogo</p>
                <h1 className="game-details-title">{game.name}</h1>
              </div>
              {criticScore && (
                <div className="game-details-score">
                  <span className="game-details-score-value">{criticScore}</span>
                  <span className="game-details-score-label">Metacritic / crítica</span>
                </div>
              )}
            </div>

            <div className="game-details-actions">
              <button
                type="button"
                className={`game-details-collection-btn ${isInCollection ? "saved" : ""}`}
                onClick={isInCollection ? handleEditCollection : handleAddToCollection}
                disabled={savingToCollection}
              >
                {isInCollection ? (
                  <>
                    <FaPen /> Editar na coleção
                  </>
                ) : (
                  <>
                    <FaPlus /> {savingToCollection ? "Adicionando..." : "Adicionar à minha coleção"}
                  </>
                )}
              </button>

              {isInCollection && (
                <button
                  type="button"
                  className="game-details-remove-btn"
                  onClick={handleRemoveFromCollection}
                >
                  <FaTrash /> Remover da coleção
                </button>
              )}
            </div>

            <div className="game-details-meta">
              <span><FaCalendarAlt /> {releaseYear}</span>
              <span><FaGamepad /> {game.platforms?.slice(0, 3).map((platform) => platform.name).join(", ") || "Sem plataforma"}</span>
              <span><FaStar /> {game.genres?.slice(0, 2).map((genre) => genre.name).join(", ") || "Sem gênero"}</span>
            </div>

            {loadError && (
              <div className="game-details-inline-warning">
                {loadError}
              </div>
            )}

            <p className="game-details-summary">
              {game.storyline || game.summary || "Sem descrição disponível para este jogo."}
            </p>

            <div className="game-details-user-stats">
              <div className="game-details-user-card">
                <span className="game-details-user-label">Meu status</span>
                <strong>{game.collectionGame?.status || "Ainda não adicionado"}</strong>
              </div>
              <div className="game-details-user-card">
                <span className="game-details-user-label">Conquistas</span>
                <strong>{game.collectionGame?.achievements ?? 0}</strong>
              </div>
              <div className="game-details-user-card">
                <span className="game-details-user-label">Minha nota</span>
                <strong>{game.collectionGame?.personalRating ?? 0}/5</strong>
              </div>
              <div className="game-details-user-card">
                <span className="game-details-user-label">Horas jogadas</span>
                <strong>{game.collectionGame?.hoursPlayed ?? 0}h</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-rawg">
        <div className="explorar-section">
          <div className="section-header">
            <h2><FaPlay style={{ color: "#ff6b6b" }} /> Trailer e destaques</h2>
          </div>

          {trailerId ? (
            <div className="game-details-trailer-wrap">
              <iframe
                className="game-details-trailer"
                src={`https://www.youtube.com/embed/${trailerId}`}
                title={`Trailer de ${game.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <>
              <div className="game-details-empty-card">
                Nenhum trailer disponível na base atual para este jogo.
              </div>

              {mediaGallery.length > 0 && (
                <div className="game-details-media-grid">
                  {mediaGallery.map((media, index) => (
                    <div key={`${media.image_id || media.id || index}`} className="game-details-media-card">
                      <img
                        src={media.url?.replace("t_thumb", "t_screenshot_big")}
                        alt={`${game.name} midia ${index + 1}`}
                        className="game-details-media-image"
                      />
                    </div>
                  ))}
                </div>
              )}

              <a
                className="game-details-youtube-link"
                href={youtubeSearchUrl}
                target="_blank"
                rel="noreferrer"
              >
                <FaPlay /> Procurar trailer no YouTube
              </a>
            </>
          )}
        </div>

        <div className="explorar-section section-stack">
          <div className="section-header">
            <h2><FaTrophy style={{ color: "#ffd700" }} /> Seu progresso</h2>
          </div>
          <div className="game-details-progress-grid">
            <div className="game-details-progress-card">
              <FaHeart />
              <span>Status</span>
              <strong>{game.collectionGame?.status || "Nao salvo"}</strong>
            </div>
            <div className="game-details-progress-card">
              <FaTrophy />
              <span>Conquistas</span>
              <strong>{game.collectionGame?.achievements ?? 0}</strong>
            </div>
            <div className="game-details-progress-card">
              <FaClock />
              <span>Horas</span>
              <strong>{game.collectionGame?.hoursPlayed ?? 0}h</strong>
            </div>
            <div className="game-details-progress-card">
              <FaStar />
              <span>Minha nota</span>
              <strong>{game.collectionGame?.personalRating ?? 0}/5</strong>
            </div>
          </div>
        </div>
      </div>

      <GameModal
        game={game.collectionGame}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCollectionGame}
        onDelete={handleDeleteCollectionGame}
      />
    </div>
  );
};

export default GameDetails;
