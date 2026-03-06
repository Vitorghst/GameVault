// 🚨 FORÇAR DNS ANTES DE TUDO
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('📡 DNS configurado:', dns.getServers());

// 👇 DOTENV DEVE VIR IMEDIATAMENTE APÓS O DNS
const dotenv = require('dotenv');
dotenv.config();

// Depois os requires normais
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const userRoutes = require('./routes/users');

const app = express();

// Configuração do CORS
app.use(cors({
    origin: ['http://localhost:3001', 'https://gamevault-backend-kumn.onrender.com'],
    credentials: true
}));

app.use(express.json());

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo_temporario',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

const PORT = process.env.PORT || 3000;

// Conexão simplificada
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro no MongoDB:', err.message);
  });