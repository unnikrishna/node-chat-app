const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3300;

const {generateMessage,generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validate.js')
const {Users} = require('./utils/users.js');

var app = express();
var publicPath = path.join(__dirname, '../public');
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('Connected to the user');

  socket.on('join', (param, callback)=>{
    if(!isRealString(param.name) || !isRealString(param.room)){
      return callback('name and room are required');
    }
    socket.join(param.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, param.name, param.room);

    io.to(param.room).emit('updateUserList', users.getUserList(param.room));
    socket.emit('newMessage',generateMessage('Admin', 'welcome to chat app'));
    socket.broadcast.to(param.room).emit('newMessage',generateMessage('Admin', `${param.name} has joined`));
    callback();
  })

  socket.on('createMessage',(message,callback)=>{
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
    }
    callback('This is from the server: New message');
  });

  socket.on('createlocation',(coords,callback)=>{
      console.log("coords : ",coords);
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name, coords.latitude, coords.longitude));;
    }
    // io.emit('newLocationMessage',generateLocationMessage(coords.latitude, coords.longitude));
    callback('This is from the server:: Geo location');
  });

  // socket.on('disconnect',()=>{
  //   console.log("user disconnected from the network hihi");
  //   socket.emit('newMessage',generateMessage('Admin', 'goodbye to chat app'));
  //   console.log(`socket id ${socket.id}`);
  //   var user = users.removeUser(socket.id);
  //   if(user){
  //     io.to(user.room).emit('updateUserList', users.getUserList(user.room));
  //     io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} has joined`));
  //   }
  // })
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
})


server.listen(port,()=>{
  console.log('server loading in ',port);
});
