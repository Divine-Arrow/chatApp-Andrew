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
    })
});


// recieve data from server
socket.on('newMessage', (data) => {
    const formatedTime = moment(data.createdAt).format('h:mm a');
    var li = $('<li>');
    li.text(`${data.from} -${formatedTime} : ${data.text}`);
    $('#messages').append(li);
});

// maps
socket.on('newLocationMessage', (data) => {
    const formatedTime = moment(data.createdAt).format('h:mm a');
    var li = $('<li>');
    var a = $('<a target="_blank">My Current Locatiopn</a>');
    li.text(`${data.from}: ${formatedTime} : `);
    a.attr('href', data.url);
    li.append(a);
    $('#messages').append(li);
    console.log(li[0]);
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