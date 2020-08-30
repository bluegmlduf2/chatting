var socket=io();

//onload
socket.on('connect',function(){
    var name=prompt('ID를 입력해주세요.');
    
    if(!name){
        name='익명';
    }

    var inputMsg=document.getElementById('msg');
    inputMsg.value='접속되었습니다.';
    socket.emit('newUser',{user:name});
})

//onload
socket.on('update',function(data){
    console.log(data.message);
    document.getElementById('chattingSpace').innerText=data.message;
});

function send(){
    var inputMsg=document.getElementById('msg').value;
    document.getElementById('msg').value='';
    socket.emit('send',{message:inputMsg});//emit::송신하다 send
}