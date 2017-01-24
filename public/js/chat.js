var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
  var param = $.deparam(window.location.search);

  socket.emit('join', param, function (err) {
    if(err){
      console.log(err);
      alert(err);
      window.location.href = '/';
    }else{
      console.log('no error');
    }
  })
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ol = $('<ol></ol>');
  users.forEach(function(user) {
    ol.append($('<li></li>').text(user));
  });
$('#users').html(ol);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    text:message.text,
    from:message.from,
    createdAt:formattedTime
  });
  $('#messages').append(html);
  scrollToBottom()
});


// location-message-template
socket.on('newLocationMessage', function (location) {
  console.log('the return value is',location);
  var formattedTime = moment(location.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    name:location.name,
    url:location.url,
    createdAt:formattedTime
  })
  $('#messages').append(html);
  scrollToBottom()
});

var messageTestBox = jQuery('[name= message]');
jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: messageTestBox.val()
  }, function (data) {
    messageTestBox.val('')
    console.log('Got it', data);
  });
});

var sendLocation = $('#sendlocation');
  sendLocation.on('click', function() {
    if(!navigator.geolocation){
      return alert('Not supported in this browser')
    }
    sendLocation.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position) {
      sendLocation.removeAttr('disabled').text('Send location');
      console.log(position);
      socket.emit('createlocation', {
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,

      }, function (data) {
        console.log('Got it::', data);
      });
    }, function(e) {
      sendLocation.removeAttr('disabled').text('Send location');
      alert('unable to fetch location')
    })
});

function scrollToBottom() {
  var message = $('#messages');
  var newMessage = message.children('li:last-child');

  var clientHeight = message.prop('clientHeight');
  var scrollTop = message.prop('scrollTop');
  var scrollHeight = message.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight){
    message.scrollTop(scrollHeight);
  }
}
