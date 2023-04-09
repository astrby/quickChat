const mongoose = require('mongoose');

const usernameSchema = new mongoose.Schema({
    username: String
},{collection: 'users'})

const Username = mongoose.model('Username', usernameSchema);
module.exports = Username;