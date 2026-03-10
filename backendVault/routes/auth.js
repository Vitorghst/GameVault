const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const CryptoJS = require('crypto-js');

const router = express.Router();

// ========== REGISTRO ==========

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔓 Descriptografa
    const bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_SECRET_KEY);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'Usuário ou email já existe' });
    }

    const hashedPassword = await bcrypt.hash(decryptedPassword, 10);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // password é o texto cifrado

    // 🔓 Descriptografa a senha
    const bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_SECRET_KEY);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Compara com o bcrypt usando a senha descriptografada
    const isMatch = await bcrypt.compare(decryptedPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Erro no login:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// ========== GOOGLE ==========
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

router.get('/google/callback',
    (req, res, next) => {
        console.log('🟡 Rota /google/callback acessada');
        console.log('📦 Query params:', req.query);
        console.log('🔑 Código recebido?', !!req.query.code);
        next();
    },
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        console.log('✅ Passport autenticou! Usuário:', req.user);
        
        const token = jwt.sign(
            { id: req.user._id, username: req.user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        console.log('🔐 Token gerado com sucesso');
        
        const frontendURL = 'game-vault-navy.vercel.app';
        res.redirect(`${frontendURL}/dashboard?token=${token}`);
    }
);

// ========== ME ==========
router.get('/me', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

module.exports = router;