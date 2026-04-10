import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameCardRAWG from "../components/GameCardRAWG";
import GameModal from "../components/GameModal";
import api from "../services/api";
import {
  FaSearch,
  FaFire,
  FaStar,
  FaGamepad,
  FaHeart,
  FaTimes,
} from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";

const DashboardRAWG = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [collection, setCollection] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [popularGames, setPopularGames] = useState([]);
  const [mostAnticipated, setMostAnticipated] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    favoritos: 0,
  });

  useEffect(() => {
    loadCollection();
    loadPopularGames();
    loadMostAnticipated();
  }, []);

  useEffect(() => {
    const query = searchTerm.trim();

    if (query.length < 2) {
      setSearchSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);
        const response = await api.post("/games/search", { search: query });
        setSearchSuggestions(response.data.slice(0, 6));
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
        setSearchSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadCollection = async () => {
    try {
      const response = await api.get("/games/collection/me");
      setCollection(response.data);

      const newStats = response.data.reduce(
        (acc, game) => {
          acc.total++;
          if (game.status === "favorito") acc.favoritos++;
          return acc;
        },
        {
          total: 0,
          favoritos: 0,
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
    try {
      const response = await api.post("/games/search", { search: searchTerm });
      setSearchResults(response.data);
      setSearchSuggestions([]);
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
    setSearchSuggestions([]);
  };

  const handleSuggestionClick = async (game) => {
    setSearchSuggestions([]);
    navigate(`/jogo/${game.id}`, {
      state: {
        game: {
          ...game,
          cover: game.cover?.url?.replace("t_thumb", "t_cover_big") || null,
        },
      },
    });
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

  const hasSearchContext = Boolean(searchTerm.trim() || searchResults.length);

  return (
    <>
      {/* Hero Search Section */}
      <div className="hero-search">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-pill">Biblioteca viva</span>
            <span className="hero-eyebrow-text">
              {collection.length > 0
                ? `${collection.length} jogos organizados no seu cofre`
                : "Seu espaço para descobrir, salvar e acompanhar games"}
            </span>
          </div>
          <h1 className="hero-title">
            Descubra <span className="gradient-text">jogos incríveis</span>
          </h1>
          <p className="hero-subtitle">
            Mais de 400.000 jogos para explorar e adicionar à sua coleção
          </p>

          <div className="hero-search-shell">
            <div className="hero-search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setSearchTerm(nextValue);
                  if (!nextValue.trim()) {
                    setSearchResults([]);
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
            {(loadingSuggestions || searchSuggestions.length > 0) && (
              <div className="search-suggestions">
                {loadingSuggestions ? (
                  <div className="search-suggestion-item muted">
                    Buscando sugestões...
                  </div>
                ) : (
                  searchSuggestions.map((game) => (
                    <button
                      key={game.id}
                      type="button"
                      className="search-suggestion-item"
                      onClick={() => handleSuggestionClick(game)}
                    >
                      <div className="search-suggestion-thumb">
                        <img
                          src={
                            game.cover?.url?.replace("t_thumb", "t_cover_small") ||
                            "https://via.placeholder.com/80x100?text=No+Image"
                          }
                          alt={game.name}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x100?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="search-suggestion-content">
                        <span className="search-suggestion-title">{game.name}</span>
                        <span className="search-suggestion-meta">
                          {game.first_release_date
                            ? new Date(game.first_release_date * 1000).getFullYear()
                            : "Sem data"}
                          {game.genres?.[0]?.name ? ` • ${game.genres[0].name}` : ""}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
            <div className="hero-search-meta">
              <div className="hero-meta-pill">
                <FaGamepad />
                <span>Exploração curada por coleção</span>
              </div>
              <div className="hero-meta-pill">
                <FaStar />
                <span>{mostAnticipated.length || 25} destaques em alta</span>
              </div>
              <div className="hero-meta-pill">
                <FaHeart />
                <span>{stats.favoritos} favoritos no radar</span>
              </div>
            </div>
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

      <div className="dashboard-overview">
        <div className="dashboard-overview-header">
          <div>
            <p className="dashboard-kicker">Resumo da sua jornada</p>
            <h2 className="dashboard-overview-title">
              Seu hub principal está pronto para mais uma rodada
            </h2>
          </div>
          <div className="dashboard-overview-badge">
            <FaFire />
            <span>
              {hasSearchContext ? "Busca ativa" : "Modo exploração"}
            </span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-block">
            <div className="stat-block-icon-wrap">
              <FaGamepad className="stat-block-icon" />
            </div>
            <div>
              <span className="stat-block-value">{stats.total}</span>
              <span className="stat-block-label">Jogos no cofre</span>
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
              <FaMagnifyingGlass className="stat-block-icon" />
            </div>
            <div>
              <span className="stat-block-value">{popularGames.length}</span>
              <span className="stat-block-label">Sugestoes em destaque</span>
            </div>
          </div>
          <div className="stat-block">
            <div className="stat-block-icon-wrap warning">
              <FaStar className="stat-block-icon" style={{ color: "#ffd700" }} />
            </div>
            <div>
              <span className="stat-block-value">{mostAnticipated.length}</span>
              <span className="stat-block-label">Mais aguardados</span>
            </div>
          </div>
        </div>

        {hasSearchContext && (
          <div className="dashboard-tabs">
            <button className="tab-btn active" onClick={clearSearch}>
              <span className="logo-explorar">
                <FaMagnifyingGlass />
              </span>{" "}
              Explorar {searchTerm && `"${searchTerm}"`}
            </button>
          </div>
        )}
      </div>

      <div className="main-content-rawg">
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
                      cover: game.cover?.url?.replace("t_thumb", "t_cover_big"),
                    }}
                    onClick={() => handleSearchResultClick(game)}
                    onDelete={handleDeleteGame}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="explorar-default">
              <div className="section-header">
                <div>
                  <h2>
                    <FaStar style={{ color: "#ffd700" }} /> Descobertas para voce
                  </h2>
                  <span className="section-subtitle">
                    Uma selecao pra começar sua proxima busca
                  </span>
                </div>
              </div>
              <div className="games-grid-rawg">
                {popularGames.map((game) => (
                  <GameCardRAWG
                    key={game.id}
                    game={{
                      ...game,
                      cover: game.cover?.url?.replace("t_thumb", "t_cover_big"),
                    }}
                    onClick={() => handleSearchResultClick(game)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="explorar-section section-stack">
          <div className="section-header">
            <h2>
              <FaFire style={{ color: "#ff6b6b" }} /> Mais Aguardados
            </h2>
            <span className="section-subtitle">
              Jogos com mais expectativa da comunidade
            </span>
          </div>
          <div className="games-grid-rawg">
            {mostAnticipated.map((game) => (
              <GameCardRAWG
                key={game.id}
                game={{
                  ...game,
                  cover: game.cover?.url?.replace("t_thumb", "t_cover_big"),
                }}
                onClick={() => handleSearchResultClick(game)}
              />
            ))}
          </div>
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

export default DashboardRAWG;
