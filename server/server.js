// require section
const
    http = require('http'),
    socketIO = require('socket.io'),
    express = require('express');


// redefining section
const
    app = express(),
    server = http.createServer(app),
    io = socketIO(server),
    port = 3000 || process.env.PORT;

// middlewares
app.use(express.static('public'));

// socket setup
io.on('connection', (socket)=>{
    console.log('new user connected.');

    // recieving data from front-end user
    socket.on('createMessage',(data)=>{
        console.log(data);
    });

    // sending new data to user
    socket.emit('newMessage', {
        from: 'server@unkown.com',
        text: 'lab lab lab',
        createdAt: 123456
    });

    // disconnect Event
    socket.on('disconnect',()=>{
        console.log('disconnected from the user');
    });

});

// listening port
server.listen(port, () => {
    console.log(`Server is started at PORT: ${port}`);
});