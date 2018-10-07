socket = io();

// scroll
var scrollToBottom = () => {
    // selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        return messages.scrollTop(clientHeight);
    }
}

// connect event
socket.on('connect', () => {
    var params = $.deparam(window.location.search);
    params.room = params.room.toLowerCase();
    $('#roomNameHead').text(params.room || params.existingRoom);
    socket.emit('join', params, (err) => {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
    })
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

// typing event
$('[name=message]').on('focusin', () => {
    socket.emit('typing');
})

$('[name=message]').on('focusout', () => {
    socket.emit('typingoff');
})



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
    scrollToBottom();
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
    scrollToBottom();
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


// list
socket.on('updateUserList', (users) => {
    var ol = $('<ol>')
    users.forEach((u) => {
        var li = $('<li>').text(u)
        ol.append(li);
    });
    $('#users').html(ol);
});

socket.on('showTyping', (userName, users) => {
    var ol = $('<ol>')
    users.forEach((user) => {
        var li = $('<li>').text(user)
        if (user === userName) {
            var em = $('<em>').text('typing...');
            li.append(em);
        }
        ol.append(li);
    });
    $('#users').html(ol);
});