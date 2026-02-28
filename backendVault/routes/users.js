const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Buscar usuários
router.get('/search', auth, async (req, res) => {
    try {
        const { q } = req.query;
        const users = await User.find({
            username: { $regex: q, $options: 'i' }
        }).select('username avatar bio');
        
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
});

// Buscar perfil de usuário
router.get('/:username', auth, async (req, res) => {
    try {
        const user = await User.findOne({ 
            username: req.params.username 
        }).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
});

module.exports = router;