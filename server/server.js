const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const port = process.env.PORT || 3000;

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

  skt.on('createMsg',(msg)=>{
    console.log('msg from client: ',msg);
    io.emit('newMsg',{
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    });
  });
});

server.listen(port,((err)=>{
  if(!err)console.log('server is up and running......');
}));
