const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    igdbId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cover: String,
     platforms: [{
        id: Number,
        name: String
    }],
    status: {
        type: String,
        enum: ['jogando', 'zerado', 'abandonado', 'quero jogar', 'favorito'],
        default: 'quero jogar'
    },
    hoursPlayed: {
        type: Number,
        default: 0
    },
    achievements: {
        type: Number,
        default: 0
    },
    personalRating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    notes: {
        type: String,
        default: ''
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

// Índice composto para evitar jogos duplicados
gameSchema.index({ userId: 1, igdbId: 1 }, { unique: true });

module.exports = mongoose.model('Game', gameSchema);