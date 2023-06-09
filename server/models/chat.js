const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatname: String,
    chat: [
        {
            username: String,
            message: String
        }
    ]
}, {collection: 'chats'})

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;