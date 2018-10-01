socket = io();

socket.on('connect', () => {
    console.log('connected to the server.');

    // sending msg obj to server

});

// disconnect event
socket.on('disconnect', () => {
    console.log('Disconnected from the server.');
});

// recieve data from server
socket.on('newMessage', (data) => {
    console.log(data);
});

// admin
socket.on('user',(data)=>{
    console.log(data.text);
});

socket.on('newUser', (data)=>{
    console.log(data.text);
});

socket.emit('createMessage', {
    from: 'one@gmail.com',
    text: 'whetever text'
}, (data)=>{
    console.log('got it', data);
});