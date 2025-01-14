const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://127.0.0.1:5500"],
    }
});

io.on('connection', socket => {
    socket.on('send-message', message => {
        // Gửi tin nhắn đến tất cả client khác
        socket.broadcast.emit('receive-message', message);
    });
    
});