socket = io();

socket.on('connect', ()=>{
    console.log('connected from front-end.');
});

socket.on('disconnect',()=>{
    console.log('disconnected from the server.');
});