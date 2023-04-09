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

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(mongoDB)
.then(()=>{
    console.log('Database '+nameDB+' connected.');
})
.catch((error)=>{
    console.log(error);
});

const io = require('socket.io')(http, {
    cors: {
        origins: 'http://localhost:3000',
        credentials: true,
         methods: ["GET", "POST"],
         allowedHeaders: ["my-custom-header"]
    },
    transports: ['websocket', 'polling', 'flashsocket']
})

io.on('connection', async(socket)=>{
    console.log('user with socket id '+socket.id+' connected.');

    socket.on('chatName', async(chatName)=>{
       const chat =  await Chat.find({chatName: chatName});
       if(chatName.length > 0){
        io.emit('chat', chat)
       }
    })

    socket.on('username', (usernameLog)=>{
        const username = new Username({username: usernameLog});
        const checkUsername = Username.find({username: usernameLog});

        if(checkUsername.length === 0){
            username.save().then(()=>{
                io.emit('username', usernameLog);
                console.log('Logged successfully')
            })
        }
    })

    socket.on('data', async(data)=>{
        const chat =  await Chat.find({chatName: data[0].chatname});
        if(chat !== undefined){
             await Chat.findOneAndUpdate({chatName: data[0].chatname}, {$push: {chat: {
                username: data[0].username,
                message: data[0].message
             }}});
            console.log('Message sent');
            socket.broadcast.emit('recentMessage', data[0])
        }else{
            const chat = new Chat({chatName: data[0].chatname, chat: {
                username: data[0].username,
                message: data[0].message
             }});
            await chat.save().then(()=>{
                console.log('Chat created');
            })
        }
    })
    
    socket.on('disconnect',()=>{
        console.log('user with socket id '+socket.id+' disconnected.')
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

