socket = io();

// connect event
socket.on('connect', () => {
    console.log('connected to the server.');
});

// disconnect event
socket.on('disconnect', () => {
    console.log('Disconnected from the server.');
});


// DOM
$('#message-form').on('submit', (e) => {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    },()=>{
        // callback code goes here.
    })
});


// recieve data from server
socket.on('newMessage', (data) => {
    var li = $('<li>');
    li.text(`${data.from} : ${data.text}`);
    $('#messages').append(li);
});
