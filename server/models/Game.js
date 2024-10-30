const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    questions: [
        {
            category: String,
            type: String,
            difficulty: String,
            question: String,
            correct_answer: String,
            incorrect_answers: [String],
        },
    ],
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    scores: {
        type: Map,
        of: Number
    },
    state: {
        type: String,
        enum: ['waiting', 'in-progress', 'finished'],
        default: 'waiting'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;