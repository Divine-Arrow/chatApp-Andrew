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
    var messageTextBox = $('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, () => {
        // delete message input
        messageTextBox.val('');
        messageTextBox.focus();
    })
});


// recieve data from server
socket.on('newMessage', (data) => {
    const formatedTime = moment(data.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        from: data.from,
        text: data.text,
        createdAt: formatedTime
    })
    $('#messages').append(html);
});

// maps
socket.on('newLocationMessage', (data) => {
    const formatedTime = moment(data.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        from: data.from,
        url: data.url,
        createdAt: formatedTime
    })
    $('#messages').append(html);
});


// location
var locationBtn = $('#send-location');
locationBtn.on('click', () => {
    if (!navigator.geolocation)
        return alert('GeoLocation is not supported by your browser.');
    locationBtn.attr('disabled', 'disabled').text('sending...');

    navigator.geolocation.getCurrentPosition((data) => {
        locationBtn.removeAttr('disabled').text('Send location');

        socket.emit('createLocationMessage', {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude
        });
    }, (e) => {
        locationBtn.removeAttr('disabled').text('Send location');
        return alert('Error: Unable to Fetch Location.');
    });

});