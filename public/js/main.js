var socket=io();

//onload
socket.on('connect',function(){
    var name=prompt('ID를 입력해주세요.');
    
    if(!name){
        name='익명';
    }

    var inputMsg=document.getElementById('msg');
    inputMsg.placeholder='접속되었습니다.';
    socket.emit('newUser',{user:name});//서버로 전송
})

//onload
socket.on('update',function(data){
    console.log(data.message);
    var chattingSpace=document.getElementById('chattingSpace');
    var currentText=chattingSpace.innerText+'\n';
    var inputText=currentText+data.message+'\n';
    chattingSpace.innerText=inputText;
    //scrollHeight는 읽기요소의 총 높이(스크롤 내부포함) ex:450px
    //scrollTop::해당 위치로 이동 ..scrollTop:450px 450px의 위치로 이동함
    chattingSpace.scrollTop = chattingSpace.scrollHeight;                                        
});

function send(){
    var inputMsg=document.getElementById('msg').value;
    document.getElementById('msg').value='';
    socket.emit('send',{message:inputMsg});//emit::송신하다 send
}

//PAGE DOMContentLoaded
document.addEventListener("DOMContentLoaded", function(){
    document.querySelector('#msg').addEventListener('keypress',(e)=>{
        if(e.keyCode===13){
            send();
        }
    });
})
