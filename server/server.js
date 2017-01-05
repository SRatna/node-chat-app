const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const port = process.env.PORT || 3000;
const {genMsg,genLocMsg} = require('./utils/message');

var publicPath = path.join(__dirname,'../public');

var app = express();
app.use(express.static(publicPath));

var server = http.createServer(app);
var io = socket(server);

io.on('connection',(skt)=>{
  console.log('new connection from user');
  skt.on('disconnect',()=>{
    console.log('connection closed by user');
  });

  skt.emit('newMsg',genMsg('admin','welcome to the group'));

  skt.broadcast.emit('newMsg',genMsg('admin','new member connected'));

  skt.on('createMsg',(msg,callback)=>{
    console.log('msg from client: ',msg);
    io.emit('newMsg',genMsg(msg.from,msg.text));
    callback('fromserver ack');
  });

  skt.on('createLocMsg',(msg)=>{
    io.emit('newLocMsg',genLocMsg('osho',msg.lt,msg.lg));
  });
});

server.listen(port,((err)=>{
  if(!err)console.log('server is up and running......');
}));
