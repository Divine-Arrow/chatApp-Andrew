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
    }, () => {
        // callback code goes here.
    })
});


// recieve data from server
socket.on('newMessage', (data) => {
    var li = $('<li>');
    li.text(`${data.from} : ${data.text}`);
    $('#messages').append(li);
});


// location
var locationBtn = $('#send-location');
locationBtn.on('click', () => {
    if (!navigator.geolocation)
        return alert('GeoLocation is not supported by your browser.');
    navigator.geolocation.getCurrentPosition((data) => {
        socket.emit('createLocationMessage', {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude
        });
    }, (e) => {
        console.log(e);
        return alert('Error: Unable to Fetch Location.');
    });

});