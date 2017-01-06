const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const port = process.env.PORT || 3000;
const {genMsg,genLocMsg} = require('./utils/message');
const {isRealStr} = require('./utils/validation');
const {Users} = require('./utils/users');

var publicPath = path.join(__dirname,'../public');

var app = express();
app.use(express.static(publicPath));

var server = http.createServer(app);
var io = socket(server);
var users = new Users();

io.on('connection',(skt)=>{
  console.log('new connection from user');

  skt.on('join',(params,callback)=>{
    if(!(isRealStr(params.name)&&isRealStr(params.room))){
      return callback('Name and Room are required');
    }
    if(users.getUserByName(params.name)){
      return callback('Name already taken please choose other name');
    }
    skt.join(params.room);
    users.removeUser(skt.id);//removeUser if he is already in other room
    users.addUser(skt.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    skt.emit('newMsg',genMsg('admin','welcome to the group'));
    skt.broadcast.to(params.room).emit('newMsg',genMsg('admin',`${params.name} joined this room`));

    callback();
  });

  skt.on('disconnect',()=>{
    console.log('connection closed by user');
    var user = users.removeUser(skt.id);

    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMsg',genMsg('admin',`${user.name} left the room.`));
    }
  });



  skt.on('createMsg',(msg,callback)=>{
    //console.log('msg from client: ',msg);
    var user = users.getUser(skt.id);
    if(user && isRealStr(msg.text)){
      io.to(user.room).emit('newMsg',genMsg(user.name,msg.text));
    }
    callback('fromserver ack');
  });

  skt.on('createLocMsg',(msg)=>{
    var user = users.getUser(skt.id);
    if(user){
      io.to(user.room).emit('newLocMsg',genLocMsg(user.name,msg.lt,msg.lg));;
    }
  });
});

server.listen(port,((err)=>{
  if(!err)console.log('server is up and running......');
}));
