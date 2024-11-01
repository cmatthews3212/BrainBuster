const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    category: String,
    id: String,
    correctAnswer: String,
    incorrectAnswers: [String],
    question: String,
    tags: [String],
    type: String,
    difficulty: String,
    regions: [String],
    isNiche: Boolean,
})

const gameSchema = new Schema({
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    questions: [questionSchema],
    scores: {
        type: Map,
        of: Number,
    },
    state: {
        type: String,
        enum: ['waiting', 'in-progress', 'finished'],
        default: 'waiting'
    },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;