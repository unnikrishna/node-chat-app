const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3300;

const {generateMessage,generateLocationMessage} = require('./utils/message.js');
var app = express();
var publicPath = path.join(__dirname, '../public');
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));
// app.get('/',function(req,res){
//   res.sendFile(path.join(publicPath+'/index.html'));
//   //__dirname : It will resolve to your project folder.
// });

io.on('connection',(socket)=>{
  console.log('Connected to the user');
  // socket.emit('newMessage',{
  //   from:"Unnikrishnan",
  //   text:"Hai h  ru"
  // });

  socket.on('createMessage',(message,callback)=>{
    console.log("message : ",message);
    io.emit('newMessage',generateMessage(message.from, message.text));
    callback('This is from the server: New message');
  });

  socket.on('createlocation',(coords,callback)=>{
    console.log("coords : ",coords);
    io.emit('newLocationMessage',generateLocationMessage(coords.latitude, coords.longitude));
    callback('This is from the server:: Geo location');
  });

  socket.on('disconnect',()=>{
    console.log("user disconnected from the network");
  })
})


server.listen(port,()=>{
  console.log('server loading in ',port);
});
