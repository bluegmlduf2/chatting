var socket=io();

socket.on('connect',function(){
    var inputMsg=document.getElementById('msg');
    inputMsg.value='접속되었습니다.';
})

function send(){
    var inputMsg=document.getElementById('msg').value;
    document.getElementById('msg').value='';
    socket.emit('send',{message:inputMsg});//emit::송신하다
}