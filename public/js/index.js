var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = $('<li></li>');
  li.text(`from:${message.from} :: message:${message.text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function (location) {
  console.log('newLocationMessage', location);
  var li = $('<li></li>');
  var a = $('<a target="_blank">My location</a>');
  li.text(`Location:${location.latitude}`);
  a.attr('href',location.url);
  li.append(a);
  $('#messages').append(li);
});


jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'Unni',
    text: jQuery('[name= message]').val()
  }, function (data) {
    console.log('Got it', data);
  });
});

var sendLocation = $('#sendlocation');
  sendLocation.on('click', function() {
    if(!navigator.geolocation){
      return alert('Not supported in this browser')
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      socket.emit('createlocation', {
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,

      }, function (data) {
        console.log('Got it::', data);
      });
    }, function(e) {
      alert('unable to fetch location')
    })
});
