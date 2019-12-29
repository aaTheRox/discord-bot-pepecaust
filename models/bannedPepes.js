const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WordsSchema = new Schema({
    word: String,
})

module.exports = mongoose.model('bannedPepes', WordsSchema);