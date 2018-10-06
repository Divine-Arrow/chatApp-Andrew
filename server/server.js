// require section
const
    http = require('http'),
    socketIO = require('socket.io'),
    express = require('express');

// our own modules
const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message'), {
    isRealString
} = require('./utils/validation'), {
    Users
} = require('./utils/users');


// redefining section
const
    app = express(),
    server = http.createServer(app),
    io = socketIO(server),
    port = process.env.PORT || 3000

var users = new Users();

// middlewares
app.use(express.static('public'));

// socket setup
io.on('connection', (socket) => {
    // send rooms list
    var rooms = users.getRoomList();
    if (rooms) {
        io.emit('roomsList', rooms);
    }

    socket.on('join', (params, callback) => {
        const newRoom = (isRealString(params.name) && isRealString(params.room));
        const existingRoom = (isRealString(params.name) && isRealString(params.existingRoom)) && params.existingRoom !== 'none';
        if (!newRoom && !existingRoom)
            return callback('All fields are required.');
        if (newRoom) {
            params.room = params.room;
        } else if (existingRoom) {
            params.room = params.existingRoom;
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chatapp'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });
    // typing
    socket.on('typing', () => {
        var user = users.getUser(socket.id);
        if (user)
            socket.to(user.room).emit('showTyping', user.name, users.getUserList(user.room));
    })

    //typing off
    socket.on('typingoff', () => {
        var user = users.getUser(socket.id);
        if (user)
            socket.to(user.room).emit('updateUserList', users.getUserList(user.room));
    })

    // recieving data from front-end user
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    // disconnect Event
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        }
    });

});

// listening port
server.listen(port, () => {
    console.log(`Server is started at PORT: ${port}`);
});