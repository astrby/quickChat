const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
const http = require('http').Server(app);
const mongoose = require('mongoose');
require('dotenv').config();
const Username = require('./models/username');
const Chat = require('./models/chat');

const usernameDB = process.env.REACT_APP_USERDB;
const passwordDB = process.env.REACT_APP_PASSWORDDB;
const nameDB = process.env.REACT_APP_NAMEDB;
const mongoDB = `mongodb+srv://${usernameDB}:${passwordDB}@cluster0.qy7pbul.mongodb.net/${nameDB}?retryWrites=true&w=majority`;

mongoose.connect(mongoDB)
.then(()=>{
    console.log('Database '+nameDB+' connected.');
})
.catch((error)=>{
    console.log(error);
});

const socketIO = require('socket.io')(http, {
    cors: {
        origin: 'https://quickchat0.netlify.app'
    }
})

socketIO.on('connection', (socket)=>{
    console.log('User connected');

    socket.on('username', async(username)=>{
        const checkUsername = await Username.find({username: username});
        if(checkUsername.length === 0){
            const userDB = new Username({
                username: username
            })
            await userDB.save()
            .then(console.log('User registered successfully'))
        }
        socket.emit('r', username)
    })

    socket.on('chatname', async(chatname) =>{
        const chat = await Chat.find({chatname: chatname});
        if(chat){
            socket.emit('chat', chat);
        }
    })

    socket.on('message', async(message)=>{
        await Chat.findOneAndUpdate({chatname: message[0].chatname}, {$push: {chat: {username: message[0].username, message: message[0].message}}})
        .then(
            socketIO.emit('newMessage', {username: message[0].username, message: message[0].message})
        )
    })

    socket.on('disconnect', ()=>{
        console.log('User disconnected')
    })
})


app.get('/getChats', async(req,res)=>{
    const chats = await Chat.find();
    if(chats.length > 0){
        res.send(chats)
    }
})


http.listen(3001, ()=>{
    console.log('Running on port 3001')
})




