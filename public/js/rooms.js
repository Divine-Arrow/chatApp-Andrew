var socket = io();

socket.on('connect', () => {
    console.log('connected to the server.');
    socket.on('roomsList', (rooms) => {
        if (rooms.length) {
            var sec = $('<select>');
            sec.append($('<option>').text('NONE'));
            rooms.forEach(room => {
                sec.append($('<option>').text(room));
            });
            return $('#rooms').html(sec);
        }
        $('.roomsSection').remove();
    });
});



// DOM with rooms

/* 
socket.on('updateUserList', (user) => {
    var ol = $('<ol>')
    user.forEach((u) =>{
        ol.append($('<li>').text(u))
    });
    $('#users').html(ol);
});
*/