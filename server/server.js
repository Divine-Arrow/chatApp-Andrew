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
    port = 3000 || process.env.PORT;

var users = new Users();

// middlewares
app.use(express.static('public'));

// socket setup
io.on('connection', (socket) => {
    // send rooms list
    var rooms = users.getRoomList();
    if(rooms) {
        io.emit('roomsList', rooms);
    }

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room))
            return callback('All fields are required.');
        socket.join(params.room);
        users.removeUser(socket.id);
        console.log('params: ', params);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chatapp'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();

    });

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