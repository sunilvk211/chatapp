const express = require('express');
const app = express();
const http = require('http');
const myserver = http.createServer(app);
const path = require('path');
const {Server} = require('socket.io');
const PORT = process.env.port || 7000;
const io = new Server(myserver) 

let users = {};
app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
});

io.on('connection',(socket)=>{
    // console.log("a user is connected: ", socket.id);

    socket.on('joined',(username)=>{
        users[socket.id] = username;
        io.emit('usersjoined',users);
    })

    socket.on('user-message',(data)=>{
        // console.log("Message receive on server"+data.u);
        socket.broadcast.emit('server-message',{user:data.u, msg:data.m});
    })
})

myserver.listen(PORT,()=>{
    console.log(`Server Running at ${PORT}`);
});