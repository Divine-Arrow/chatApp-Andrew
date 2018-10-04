// require section
const
    http = require('http'),
    socketIO = require('socket.io'),
    express = require('express');

// our own modules
const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');


// redefining section
const
    app = express(),
    server = http.createServer(app),
    io = socketIO(server),
    port = 3000 || process.env.PORT;

// middlewares
app.use(express.static('public'));

// socket setup
io.on('connection', (socket) => {
    console.log('new user connected.');

    // emit Admin greet
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chatapp'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

    // recieving data from front-end user
    socket.on('createMessage', (data, callback) => {
        io.emit('newMessage', generateMessage(data.from, data.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    // disconnect Event
    socket.on('disconnect', () => {
        console.log('disconnected from the user');
    });

});

// listening port
server.listen(port, () => {
    console.log(`Server is started at PORT: ${port}`);
});