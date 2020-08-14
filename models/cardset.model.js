const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    prompt: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const cardSetSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    cards: [cardSchema]
});

const CardSet = mongoose.model('CardSet', cardSetSchema);

module.exports = CardSet;