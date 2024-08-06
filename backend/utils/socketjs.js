const { Server } = require("socket.io");

// New Web Socket server
const io = new Server({
    cors: {
        origin: ["http://localhost:3000", "http://localhost:54287", "http://localhost:55218"], // Updated to allow multiple origins
        methods: ["GET", "POST"]
    }
});

// Declaring socket to take the same event from io
var Socket = {
    emit: function (event, data) {
        io.emit(event, data);
    },
};

// This is only for test purposes
io.on('connection', (socket) => {
    console.log('a user connected');
});

exports.Socket = Socket;
exports.io = io;
