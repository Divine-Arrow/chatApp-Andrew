socket = io();

socket.on('connect', () => {
    console.log('connected to the server.');

    // sending msg obj to server
    socket.emit('createMessage', {
        from: 'current@user.com',
        msg: 'hellu'
    });

});

// disconnect event
socket.on('disconnect', () => {
    console.log('Disconnected from the server.');
});

// recieve data from server
socket.on('newMessage', (data)=>{
    console.log(data);
});