// Blacklisted users (by discord id)
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: Number,
})

module.exports = mongoose.model('users', UserSchema);