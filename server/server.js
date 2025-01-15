const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://127.0.0.1:5500", "https://admin.socket.io"],
        credentials: true
    },
    debug: true
});

//middleware
const userIo = io.of('/user'); //namespace

userIo.on('connection', socket => {
    console.log('Connected to user namespace with username: ', socket.username);
});

userIo.use((socket, next) => {
    if(socket.handshake.auth.token){
        socket.username = getUsernameFromToken(socket.handshake.auth.token);
        next();
    } else{
        next(new Error('Please send token'));
    }
});

function getUsernameFromToken(token){
    return token;
}

io.on('connection', socket => {
    socket.on('send-message', (message, room) => {
        if(room === '') {
        // Gửi tin nhắn đến tất cả client khác trừ người gửi 
        socket.broadcast.emit('receive-message', message);
        } else {
            socket.to(room).emit('receive-message', message);
        }
    });

    socket.on('join-room', (room, cb)  => {
        socket.join(room);
        cb(`Joined ${room}`); //callback thông báo đã join room
    });
    socket.on('ping', (count) => {
        console.log('ping', count);
    });
});

instrument(io, {auth: false}); //admin ui
//https://admin.socket.io