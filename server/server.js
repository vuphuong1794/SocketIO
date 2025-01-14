const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://127.0.0.1:5500"],
    }
});

io.on('connection', socket => {
    socket.on('send-message', (message, room) => {
        if(room === '') {
        // Gửi tin nhắn đến tất cả client khác trừ người gửi 
        socket.broadcast.emit('receive-message', message);
        } else {
            socket.to(room).emit('receive-message', message);
        }
    });

    socket.on('join-room', room => {
        socket.join(room);
    });
    
});