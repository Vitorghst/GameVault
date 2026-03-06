import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import GameCardRAWG from "../components/GameCardRAWG";
import GameModal from "../components/GameModal";
import api from "../services/api";
import {
  FaSearch,
  FaFire,
  FaStar,
  FaClock,
  FaTrophy,
  FaGamepad,
  FaHeart,
  FaHourglassHalf,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { BsFillCollectionFill } from "react-icons/bs";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { IoLogoGameControllerB } from "react-icons/io";
import { FaMagnifyingGlass } from "react-icons/fa6";

const DashboardRAWG = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [collection, setCollection] = useState([]);
  const [filteredCollection, setFilteredCollection] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [activeTab, setActiveTab] = useState("colecao");
  const [popularGames, setPopularGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [mostAnticipated, setMostAnticipated] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    jogando: 0,
    zerados: 0,
    favoritos: 0,
    totalHoras: 0,
    totalConquistas: 0,
  });

  useEffect(() => {
    loadCollection();
    loadPopularGames();
    loadMostAnticipated();
  }, []);

  const loadCollection = async () => {
    try {
      const response = await api.get("/games/collection/me");
      setCollection(response.data);
      setFilteredCollection(response.data);

      const newStats = response.data.reduce(
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
      console.error("Erro ao carregar coleção:", error);
    }
  };

  const loadPopularGames = async () => {
    try {
      const response = await api.post("/games/search", { search: "popular" });
      setPopularGames(response.data.slice(0, 6));
      setRecentGames(response.data.slice(6, 12));
    } catch (error) {
      console.error("Erro ao carregar jogos populares:", error);
    }
  };

  const loadMostAnticipated = async () => {
    try {
      const response = await api.post("/games/search/most-anticipated", {
        limit: 25,
      });
      setMostAnticipated(response.data);
      // Use os dados como quiser
    } catch (error) {
      console.error("Erro ao carregar mais aguardados:", error);
    }
  };

  const searchGames = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setActiveTab("explorar");
    try {
      const response = await api.post("/games/search", { search: searchTerm });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Erro ao buscar jogos");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const handleSearchResultClick = async (game) => {
    if (
      game.first_release_date &&
      game.first_release_date * 1000 > Date.now()
    ) {
      return;
    }
    setSelectedGame({
      igdbId: game.id,
      name: game.name,
      cover: game.cover?.url?.replace("t_thumb", "t_cover_big"),
      released: game.first_release_date,
      genres: game.genres,
      summary: game.summary,
      ...game,
    });
    setModalOpen(true);
  };

  const handleSaveGame = async (gameData) => {
    console.log(gameData);
    try {
      if (gameData._id) {
        await api.put(`/games/${gameData._id}`, gameData);
      } else {
        const coverUrl = gameData.cover?.url || "";
        const processedCover = coverUrl.replace("t_thumb", "t_cover_big");

        await api.post("/games/add", {
          igdbId: gameData.igdbId,
          name: gameData.name,
          cover: processedCover,
          status: gameData.status,
          platforms: gameData.platforms || [],
          hoursPlayed: gameData.hoursPlayed,
          achievements: gameData.achievements,
          personalRating: gameData.personalRating,
          notes: gameData.notes,
        });
      }

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
    } else {
      setFilteredCollection(
        collection.filter((game) => game.status === filter),
      );
    }
  };

  return (
    <>
      {/* Hero Search Section */}
      <div className="hero-search">
        <div className="hero-content">
          <h1 className="hero-title">
            Descubra <span className="gradient-text">jogos incríveis</span>
          </h1>
          <p className="hero-subtitle">
            Mais de 400.000 jogos para explorar e adicionar à sua coleção
          </p>

          <div className="hero-search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!e.target.value.trim()) {
                    setActiveTab("explorar");
                  }
                }}
                onKeyPress={(e) => e.key === "Enter" && searchGames()}
                placeholder="Buscar jogos por nome, gênero, plataforma..."
              />
              {searchTerm && (
                <button
                  className="clear-search-btn"
                  onClick={clearSearch}
                  type="button"
                >
                  <FaTimes />
                </button>
              )}
            <button
              onClick={searchGames}
              disabled={loading || !searchTerm.trim()}
            >
              Buscar
            </button>
          </div>

          <div className="search-trends">
            <span>Populares:</span>
            <button onClick={() => setSearchTerm("The Witcher")}>
              The Witcher
            </button>
            <button onClick={() => setSearchTerm("Zelda")}>Zelda</button>
            <button onClick={() => setSearchTerm("God of War")}>
              God of War
            </button>
            <button onClick={() => setSearchTerm("Red Dead")}>Red Dead</button>
            <button onClick={() => setSearchTerm("Elden Ring")}>
              Elden Ring
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-block">
          <FaGamepad className="stat-block-icon" />
          <div>
            <span className="stat-block-value">{stats.total}</span>
            <span className="stat-block-label">Jogos na coleção</span>
          </div>
        </div>
        <div className="stat-block">
          <FaHeart className="stat-block-icon" style={{ color: "#ff4d4d" }} />
          <div>
            <span className="stat-block-value">{stats.favoritos}</span>
            <span className="stat-block-label">Favoritos</span>
          </div>
        </div>
        <div className="stat-block">
          <FaClock className="stat-block-icon" />
          <div>
            <span className="stat-block-value">
              {Math.floor(stats.totalHoras / 24)}d
            </span>
            <span className="stat-block-label">Total jogado</span>
          </div>
        </div>
        <div className="stat-block">
          <FaTrophy className="stat-block-icon" style={{ color: "#ffd700" }} />
          <div>
            <span className="stat-block-value">{stats.totalConquistas}</span>
            <span className="stat-block-label">Conquistas</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "colecao" ? "active" : ""}`}
          onClick={() => setActiveTab("colecao")}
        >
          <BsFillCollectionFill /> Minha Coleção ({collection.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "explorar" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("explorar");
            setSearchResults([]);
          }}
        >
          <span className="logo-explorar">
            <FaMagnifyingGlass />
          </span>{" "}
          Explorar {searchTerm && `"${searchTerm}"`}
        </button>
      </div>

      <div className="main-content-rawg">
        {/* Explorar / Resultados de Busca */}
        {activeTab === "explorar" && (
          <div className="explorar-section">
            {searchResults.length > 0 ? (
              <>
                <div className="section-header">
                  <div>
                    <h2>Resultados para "{searchTerm}"</h2>
                    <span className="results-count">
                      {searchResults.length} jogos encontrados
                    </span>
                  </div>
                  <button
                    className="suggested-user-follow-btn-clean"
                    onClick={clearSearch}
                  >
                    <FaTimes /> Limpar busca
                  </button>
                </div>
                <div className="games-grid-rawg">
                  {searchResults.map((game) => (
                    <GameCardRAWG
                      key={game.id}
                      game={{
                        ...game,
                        cover: game.cover?.url?.replace(
                          "t_thumb",
                          "t_cover_big",
                        ),
                      }}
                      onClick={() => handleSearchResultClick(game)}
                      onDelete={handleDeleteGame}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="explorar-default">
                {/* Seção de populares */}
                <div className="section-header">
                  <h2>
                    <FaFire style={{ color: "#ff6b6b" }} /> Mais Aguardados
                  </h2>
                </div>
                <div className="games-grid-rawg">
                  {mostAnticipated.map(
                    (
                      game, // 👈 MUDEI DE popularGames PARA recentGames
                    ) => (
                      <GameCardRAWG
                        key={game.id}
                        game={{
                          ...game,
                          cover: game.cover?.url?.replace(
                            "t_thumb",
                            "t_cover_big",
                          ),
                        }}
                        onClick={() => handleSearchResultClick(game)}
                      />
                    ),
                  )}
                </div>

                {/* Seção de lançamentos */}
                {/* <div className="section-header" style={{ marginTop: "48px" }}>
                  <h2>
                    <FaStar style={{ color: "#ffd700" }} /> Novos Lançamentos
                  </h2>
                  <span className="section-subtitle">Últimos 30 dias</span>
                </div>
                <div className="games-grid-rawg">
                  {recentGames.map((game) => (
                    <GameCardRAWG
                      key={game.id}
                      game={{
                        ...game,
                        cover: game.cover?.url?.replace(
                          "t_thumb",
                          "t_cover_big",
                        ),
                      }}
                      onClick={() => handleSearchResultClick(game)}
                    />
                  ))}
                </div> */}
              </div>
            )}
          </div>
        )}

        {/* Minha Coleção */}
        {activeTab === "colecao" && (
          <div className="colecao-section">
            <div className="section-header">
              <h2>
                {" "}
                <span className="logo-collection">
                  <BsFillCollectionFill />
                </span>{" "}
                Minha Coleção
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
                  </span>{" "}
                  Jogando (
                  {collection.filter((g) => g.status === "jogando").length})
                </button>
                <button
                  className={`filter-chip ${activeFilter === "zerado" ? "active" : ""}`}
                  onClick={() => filterCollection("zerado")}
                >
                  <span className="logo-finalizado">
                    <RiVerifiedBadgeFill />
                  </span>{" "}
                  Zerados (
                  {collection.filter((g) => g.status === "zerado").length})
                </button>
                <button
                  className={`filter-chip ${activeFilter === "favorito" ? "active" : ""}`}
                  onClick={() => filterCollection("favorito")}
                >
                  <span className="logo-favoritos">
                    <FaHeart />
                  </span>{" "}
                  Favoritos (
                  {collection.filter((g) => g.status === "favorito").length})
                </button>
                <button
                  className={`filter-chip ${activeFilter === "quero jogar" ? "active" : ""}`}
                  onClick={() => filterCollection("quero jogar")}
                >
                  <span className="logo-quero">
                    <FaHourglassHalf />
                  </span>{" "}
                  Quero Jogar (
                  {collection.filter((g) => g.status === "quero jogar").length})
                </button>
              </div>
            </div>

            {filteredCollection.length === 0 ? (
              <div className="empty-collection">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                  alt="Empty"
                />
                <h3>Sua coleção está vazia</h3>
                <p>
                  Busque jogos na aba Explorar e comece a construir sua
                  biblioteca!
                </p>
                <button
                  className="explorar-btn"
                  onClick={() => setActiveTab("explorar")}
                >
                  Explorar Jogos
                </button>
              </div>
            ) : (
              <div className="games-grid-rawg">
                {filteredCollection.map((game) => (
                  <GameCardRAWG
                    key={game._id}
                    game={game}
                    onClick={() => handleGameClick(game)}
                    onDelete={handleDeleteGame}
                  />
                ))}
              </div>
            )}
          </div>
        )}
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

export default DashboardRAWG;
