const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const userRoutes = require('./routes/users');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API da Coleção de Jogos funcionando!' });
});

const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB e iniciar servidor
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Conectado ao MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro no MongoDB:', err);
    });