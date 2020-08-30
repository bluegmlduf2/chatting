const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');//Log
const app = express();//express
const http =require('http');//nodeJs에서 제공하는 서버 모듈
const socket=require('socket.io');//소켓모듈

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const server=http.createServer(app);//express Http 서버 생성
const io=socket(server);//서버를 소켓에 연결한 후 io를 받아옴

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/css',express.static('./public/css'));
app.use('/js',express.static('./public/js'));
//이 경우 localhost:5000/css/main.css 라는 url이 넘어올 경우 app.js가 위치한 localhost:5000/public/css/main.css 의 경로로 접근이 허가된다.

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//sockets(단체),socket(개인)
//Socket은 클라이언트와 서버의 통로이며 지속적인 연결상태를 유지해준다.(양방향 통신 유지)
//아래의 server.listen()로 서버가 생성되기 전에 서버에 소켓(통로기능)을 추가한 것.
//io.sockets는 접속되는 모든 소켓
io.sockets.on('connection',function(socket){
  console.log('user connected..');

  //새로운 유저 입장시
  socket.on('newUser',function(data){
    console.log('userName::'+data.user);
    socket.name=data.user;//해당 소켓의 name 변수에 사용자 이름 저장(개인소켓에 전역변수)
    io.sockets.emit('update',{message:"SERVER: "+data.user+"님이 접속하셨습니다."});//본인 포함, 모든 유저(sockets)에게 전송
  });

  //main.js에서 send라는 키값으로 emit을 이용하여 전송함
  socket.on('send',function(data){
    data.name=socket.name;//data변수로 main.js에서 메세지를 받으면 해당 data 변수안에 name이라는 키값을 추가하고 newUser에서 지정한 name을 넣어줌 
    socket.broadcast.emit('update',{message:data.name+": "+data.message});//본인 제외, 모든 유저에게 전송. io.socket.emit()의 반대
  });

  //소켓의 정보가 연결종료일 경우
  socket.on('disconnect',function(){
    socket.broadcast.emit('update',{message:"SERVER: "+socket.name+"님이 나가셨습니다."});
    console.log('End connection..');
  })
})

//서버 가동..
//Server on
server.listen(5000,function(){
  console.log('Server is Running...');
});

module.exports = app;//해당 app.js를 호출하는곳은 wwww이다.
