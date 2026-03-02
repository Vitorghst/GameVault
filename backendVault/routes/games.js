const express = require("express");
const axios = require("axios");
const Game = require("../models/Game");
const auth = require("../middleware/auth");

const router = express.Router();

// Configuração da API IGDB
const IGDB_API = "https://api.igdb.com/v4";
let accessToken = null;
let tokenExpiry = null;

// Função para obter token da IGDB
async function getIGDBAccessToken() {
  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: process.env.IGDB_CLIENT_ID,
          client_secret: process.env.IGDB_CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      },
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (err) {
    console.error("Erro ao obter token IGDB:", err);
    throw err;
  }
}

// Buscar jogos na IGDB
router.post("/search", auth, async (req, res) => {
  try {
    const { search } = req.body;
    const token = await getIGDBAccessToken();

    const response = await axios.post(
      `${IGDB_API}/games`,
      `search "${search}"; 
             fields name,cover.url,summary,first_release_date,genres.name,platforms.name;
             limit 20;`,
      {
        headers: {
          "Client-ID": process.env.IGDB_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar jogos" });
  }
});

// Adicionar jogo à coleção
router.post("/add", auth, async (req, res) => {
  try {
    const {
      igdbId,
      name,
      cover,
      platforms,
      status,
      hoursPlayed,
      achievements,
      personalRating,
      notes,
    } = req.body;

    const game = new Game({
      userId: req.user.id,
      igdbId,
      name,
      cover,
      platforms: platforms || [], // 👈 SALVA AS PLATAFORMAS (ou array vazio)
      status,
      hoursPlayed,
      achievements,
      personalRating,
      notes,
    });

    await game.save();
    res.status(201).json(game);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "Jogo já está na sua coleção" });
    } else {
      console.error(err);
      res.status(500).json({ message: "Erro ao adicionar jogo" });
    }
  }
});

// Listar coleção do usuário
router.get("/collection/me", auth, async (req, res) => {
  try {
    const games = await Game.find({ userId: req.user.id }).sort({
      addedAt: -1,
    });
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar coleção" });
  }
});

// backend/routes/games.js
// backend/routes/games.js
router.post('/search/most-anticipated', auth, async (req, res) => {
    try {
        console.log('🔍 Buscando jogos mais aguardados...');
        
        const token = await getIGDBAccessToken();
        console.log('✅ Token obtido');
        
        const { limit = 25 } = req.body;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        console.log('📅 Timestamp atual:', currentTimestamp);

        const query = `
            fields name, 
                   cover.url, 
                   first_release_date,
                   hypes,
                   rating,
                   summary,
                   platforms.name,
                   genres.name;
            where hypes != null 
              & hypes > 10
              & first_release_date > ${currentTimestamp};
            sort hypes desc;
            limit ${limit};
        `;

        console.log('📤 Query enviada:', query);

        const response = await axios.post(
            `${IGDB_API}/games`,
            query,
            {
                headers: {
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        );

        console.log(`✅ ${response.data.length} jogos encontrados`);
        res.json(response.data);
        
    } catch (err) {
        console.error('❌ ERRO DETALHADO:');
        console.error('Mensagem:', err.message);
        console.error('Resposta da API:', err.response?.data);
        console.error('Status:', err.response?.status);
        console.error('Headers:', err.response?.headers);
        
        res.status(500).json({ 
            message: 'Erro ao buscar jogos mais aguardados',
            error: err.message 
        });
    }
});

// Atualizar jogo
router.put("/:gameId", auth, async (req, res) => {
  try {
    const game = await Game.findOneAndUpdate(
      { _id: req.params.gameId, userId: req.user.id },
      req.body,
      { new: true },
    );

    if (!game) {
      return res.status(404).json({ message: "Jogo não encontrado" });
    }

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar jogo" });
  }
});

// Remover jogo
router.delete("/:gameId", auth, async (req, res) => {
  try {
    const game = await Game.findOneAndDelete({
      _id: req.params.gameId,
      userId: req.user.id,
    });

    if (!game) {
      return res.status(404).json({ message: "Jogo não encontrado" });
    }

    res.json({ message: "Jogo removido com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao remover jogo" });
  }
});

module.exports = router;
