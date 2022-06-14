const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

app.use(cors());

const { Server } = require('socket.io');



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3002",
        methods: ["GET", "POST"],
    }
});

io.on('connection', (socket) => {
    console.log('user connected ', socket.id);
    
    socket.on("joinroom", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} has joined room with ID: ${data}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected ', socket.id);
    })
})

server.listen(3001, () => {
    console.log('Running on port 3001...');
})