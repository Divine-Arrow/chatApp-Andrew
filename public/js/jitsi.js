let myJitsi;
let userName = $.deparam(window.location.search)?.name??'Anonymous';
let roomName;
const createRoom = () => {
    // roomName = socket.id;
    roomName = `myRoom_${socket.id}_${Date.now()}`;
    return roomName;
}

const startCall = (roomName) => {
    // const domain = 'meet.jit.si';
    const domain = 'jitsi.meest4bharat.net';
    const options = {
        roomName: roomName??createRoom(),
        width: 800,
        height: 700,
        parentNode: document.querySelector('#jitsi_div'),
        configOverwrite:{
            doNotStoreRoom: true,
            startVideoMuted: 0,
            startWithVideoMuted: true,
            startWithAudioMuted: true,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            disableRemoteMute: true,
            remoteVideoMenu: { disableKick: true }
        },
        userInfo: {
            displayName: userName
        },
        interfaceConfigOverwrite: {
            filmStripOnly: false,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_REMOTE_DISPLAY_NAME: 'New User',
            TOOLBAR_BUTTONS: []
        },
        onload: function () {
            $('#messages').hide();
            $('#calling_div').show();
        },
    };

    myJitsi = new JitsiMeetExternalAPI(domain, options);

    myJitsi.addListener('readyToClose', () => {
        $('#messages').show();
        $('#calling_div').hide();
        $("#jitsi_div").empty()
   });
    myJitsi.addListener('participantLeft', () => {
        jitsi_hangUpCall();
        $('#messages').show();
        $('#calling_div').hide();
        $("#jitsi_div").empty();
   });
};

// start call
$("#startCall").on('click', () => {
    startCall();
    // myJitsi.executeCommand('displayName', userName);
    socket.emit('calling', { roomName, userName })
});

const jitsi_hangUpCall = () => {
    myJitsi.executeCommand('hangup');
    $('#messages').show();
    $('#calling_div').hide();
}

$("#hangUpBtn").on('click', jitsi_hangUpCall);

window.onload = () => {
    $('#messages').show();
    $('#calling_div').hide();    
    $('#call_notf').hide();    
}
