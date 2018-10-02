// require section
const
    http = require('http'),
    socketIO = require('socket.io'),
    express = require('express');

// our own modules
const 
    {generateMessage} = require('./utils/message');


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

    // emit admin greet
    socket.emit('newMessage', generateMessage('admin', 'welcome to the chatapp'));

    socket.broadcast.emit('newMessage', generateMessage('admin', 'new user joined.'));

    // recieving data from front-end user
    socket.on('createMessage', (data, callback) => {
        io.emit('newMessage', generateMessage(data.from, data.text));
        callback('Ok');
    });
    
    socket.on('createLocationMessage', (coords)=>{
        io.emit('newMessage', generateMessage('admin', `${coords.latitude}, ${coords.longitude}`));
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