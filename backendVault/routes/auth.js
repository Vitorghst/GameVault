const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const auth = require('../middleware/auth');

const router = express.Router();

function resolvePassword(passwordInput) {
  if (typeof passwordInput !== 'string' || !passwordInput.trim()) {
    return '';
  }

  if (process.env.CRYPTO_SECRET_KEY) {
    try {
      const bytes = CryptoJS.AES.decrypt(passwordInput, process.env.CRYPTO_SECRET_KEY);
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (decryptedPassword) {
        return decryptedPassword;
      }
    } catch (err) {
      console.error('Erro ao descriptografar senha:', err.message);
    }
  }

  return passwordInput;
}

// ========== REGISTRO ==========

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedUsername = username?.trim();
    const resolvedPassword = resolvePassword(password);

    if (!normalizedUsername || !normalizedEmail || !resolvedPassword) {
      return res.status(400).json({ message: 'Username, email e senha são obrigatórios' });
    }

    let user = await User.findOne({ $or: [{ email: normalizedEmail }, { username: normalizedUsername }] });
    if (user) {
      return res.status(400).json({ message: 'Usuário ou email já existe' });
    }

    const hashedPassword = await bcrypt.hash(resolvedPassword, 10);

    user = new User({
      username: normalizedUsername,
      email: normalizedEmail,
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

    if (err.code === 11000) {
      return res.status(400).json({ message: 'Usuário ou email já existe' });
    }

    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const resolvedPassword = resolvePassword(password);

    if (!normalizedEmail || !resolvedPassword) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Use o login social para acessar esta conta' });
    }

    const isMatch = await bcrypt.compare(resolvedPassword, user.password);
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
        
        const frontendURL =
            process.env.FRONTEND_URL || 'https://gamevault-test.vercel.app';
        res.redirect(`${frontendURL}/dashboard?token=${token}`);
    }
);

// ========== ME ==========
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
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
