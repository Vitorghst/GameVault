import React, { useEffect, useState } from "react";
import { FaClock, FaFilter, FaGamepad, FaHeart, FaHourglassHalf, FaTrophy } from "react-icons/fa";
import { BsFillCollectionFill } from "react-icons/bs";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { IoLogoGameControllerB } from "react-icons/io";
import GameCardRAWG from "../components/GameCardRAWG";
import GameModal from "../components/GameModal";
import api from "../services/api";

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [filteredCollection, setFilteredCollection] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [stats, setStats] = useState({
    total: 0,
    favoritos: 0,
    totalHoras: 0,
    totalConquistas: 0,
  });

  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      const response = await api.get("/games/collection/me");
      setCollection(response.data);
      setFilteredCollection(response.data);

      const newStats = response.data.reduce(
        (acc, game) => {
          acc.total += 1;
          if (game.status === "favorito") acc.favoritos += 1;
          acc.totalHoras += game.hoursPlayed || 0;
          acc.totalConquistas += game.achievements || 0;
          return acc;
        },
        {
          total: 0,
          favoritos: 0,
          totalHoras: 0,
          totalConquistas: 0,
        },
      );

      setStats(newStats);
    } catch (error) {
      console.error("Erro ao carregar coleção:", error);
    }
  };

  const handleSaveGame = async (gameData) => {
    try {
      await api.put(`/games/${gameData._id}`, gameData);
      setModalOpen(false);
      loadCollection();
    } catch (error) {
      console.error("Erro ao salvar jogo:", error);
      alert(error.response?.data?.message || "Erro ao salvar jogo");
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      await api.delete(`/games/${gameId}`);
      setModalOpen(false);
      loadCollection();
    } catch (error) {
      console.error("Erro ao deletar jogo:", error);
      alert("Erro ao remover jogo");
    }
  };

  const filterCollection = (filter) => {
    setActiveFilter(filter);

    if (filter === "todos") {
      setFilteredCollection(collection);
      return;
    }

    setFilteredCollection(collection.filter((game) => game.status === filter));
  };

  return (
    <>
      <div className="dashboard-overview collection-overview">
        <div className="dashboard-overview-header">
          <div>
            <p className="dashboard-kicker">Seu cofre pessoal</p>
            <h1 className="dashboard-overview-title">Coleção organizada para acompanhar tudo o que você joga</h1>
          </div>
          <div className="dashboard-overview-badge">
            <BsFillCollectionFill />
            <span>{collection.length} jogos salvos</span>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-block">
            <div className="stat-block-icon-wrap">
              <FaGamepad className="stat-block-icon" />
            </div>
            <div>
              <span className="stat-block-value">{stats.total}</span>
              <span className="stat-block-label">Jogos na colecao</span>
            </div>
          </div>
          <div className="stat-block">
            <div className="stat-block-icon-wrap danger">
              <FaHeart className="stat-block-icon" style={{ color: "#ff4d4d" }} />
            </div>
            <div>
              <span className="stat-block-value">{stats.favoritos}</span>
              <span className="stat-block-label">Favoritos</span>
            </div>
          </div>
          <div className="stat-block">
            <div className="stat-block-icon-wrap accent">
              <FaClock className="stat-block-icon" />
            </div>
            <div>
              <span className="stat-block-value">{Math.floor(stats.totalHoras / 24)}d</span>
              <span className="stat-block-label">Tempo investido</span>
            </div>
          </div>
          <div className="stat-block">
            <div className="stat-block-icon-wrap warning">
              <FaTrophy className="stat-block-icon" style={{ color: "#ffd700" }} />
            </div>
            <div>
              <span className="stat-block-value">{stats.totalConquistas}</span>
              <span className="stat-block-label">Conquistas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-rawg">
        <div className="colecao-section">
          <div className="section-header">
            <h2>
              <span className="logo-collection">
                <BsFillCollectionFill />
              </span>
              Minha Colecao
            </h2>
            <div className="filters-rawg">
              <FaFilter className="filter-icon" />
              <button
                className={`filter-chip ${activeFilter === "todos" ? "active" : ""}`}
                onClick={() => filterCollection("todos")}
              >
                Todos ({collection.length})
              </button>
              <button
                className={`filter-chip ${activeFilter === "jogando" ? "active" : ""}`}
                onClick={() => filterCollection("jogando")}
              >
                <span className="logo-jogando">
                  <IoLogoGameControllerB />
                </span>
                Jogando ({collection.filter((g) => g.status === "jogando").length})
              </button>
              <button
                className={`filter-chip ${activeFilter === "zerado" ? "active" : ""}`}
                onClick={() => filterCollection("zerado")}
              >
                <span className="logo-finalizado">
                  <RiVerifiedBadgeFill />
                </span>
                Zerados ({collection.filter((g) => g.status === "zerado").length})
              </button>
              <button
                className={`filter-chip ${activeFilter === "favorito" ? "active" : ""}`}
                onClick={() => filterCollection("favorito")}
              >
                <span className="logo-favoritos">
                  <FaHeart />
                </span>
                Favoritos ({collection.filter((g) => g.status === "favorito").length})
              </button>
              <button
                className={`filter-chip ${activeFilter === "quero jogar" ? "active" : ""}`}
                onClick={() => filterCollection("quero jogar")}
              >
                <span className="logo-quero">
                  <FaHourglassHalf />
                </span>
                Quero Jogar ({collection.filter((g) => g.status === "quero jogar").length})
              </button>
            </div>
          </div>

          {filteredCollection.length === 0 ? (
            <div className="empty-collection">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                alt="Empty"
              />
              <h3>Sua colecao esta vazia</h3>
              <p>Use a busca na dashboard para descobrir novos jogos e trazer eles para ca.</p>
            </div>
          ) : (
            <div className="games-grid-rawg">
              {filteredCollection.map((game) => (
                <GameCardRAWG
                  key={game._id}
                  game={game}
                  onClick={() => {
                    setSelectedGame(game);
                    setModalOpen(true);
                  }}
                  onDelete={handleDeleteGame}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <GameModal
        game={selectedGame}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveGame}
        onDelete={handleDeleteGame}
      />
    </>
  );
};

export default Collection;
