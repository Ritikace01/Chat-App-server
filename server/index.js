const express = require('express');
const app = express();
const router = require('./router');
const socketio = require('socket.io');
const cors = require('cors');
app.use(cors({ origin: true }));

// helper functions
const { addUser, removeUser, getUser, getUserInRoom, getAllUsers } = require('./users');

const PORT = process.env.PORT || 3001;

app.use(router);

const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

const io = socketio(server);
io.on('connect', (socket) => {
    console.log("New connection!!");

    // when a user joins a room
    // 'join' event emitted  by client
    socket.on('join', ({name, room}, callback) => {
        console.log("Client details : ", name, room);
        const { error, user } = addUser({ id: socket.id, name, room });
        if(error) return callback(error);
        getAllUsers();
        // admin messages
        socket.emit("message", { user: 'admin', text: `${user.name} welcome to the room ${user.room}`});
        // broadcasting message to the room
        socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name}, has joined!!`});

        // add user to the room
        socket.join(user.room);
        callback();
    });

    // 'sendMessage' event emitted by client
    socket.on('sendMessage', (message, callback) => {
        getAllUsers();
        const user = getUser(socket.id);
        io.to(user.room).emit("message", {user: user.name, text: message});
        callback();
    })

    socket.on('disconnection', () => {
        console.log("User has left!!");
        // need to remove the user from users array
        const user = removeUser(socket.id);
        console.log("Removed user : ", user);
        if(user) {
            io.to(user.room).emit("message", { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit("roomData", { room: user.room, users: getUserInRoom(user.room)});
          }
    })
})