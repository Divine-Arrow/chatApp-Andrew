var socket = io();

socket.on('connect', () => {
    console.log('connected to the server.');
    socket.on('roomsList', (rooms) => {
        rooms = $.unique(rooms);
        if (rooms.length) {
            var section = $('<select>').attr('name', 'existingRoom');
            section.append($('<option>').text('NONE').attr('value', 'none'));
            rooms.forEach(room => {
                section.append($('<option>').text(room).attr(`value`, room));
            });
            return $('#rooms').html(section);
        }
        $('.roomsSection').remove();
    });
});

// send 