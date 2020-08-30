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
app.use('/users', usersRouter);

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

//Socket은 클라이언트와 서버의 통로이며 지속적인 연결상태를 유지해준다.(양방향 통신 유지)
//아래의 server.listen()로 서버가 생성되기 전에 서버에 소켓(통로기능)을 추가한 것.
//io.sockets는 접속되는 모든 소켓
io.sockets.on('connection',function(socket){
  console.log('user connected..');
  //접속과 동시에 콜백함수로 전달되는 소켓은 접속된 해당 소켓
  socket.on('send',function(data){
    console.log('send message::'+data.message)
  });
  //소켓의 정보가 연결종료일 경우
  socket.on('disconnect',function(){
    console.log('End connection..');
  })
})

//서버 가동..
//Server on
server.listen(5000,function(){
  console.log('Server is Running...');
});

module.exports = app;//해당 app.js를 호출하는곳은 wwww이다.
