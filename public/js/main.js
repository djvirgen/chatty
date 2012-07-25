jQuery(function($) {
  var $messages = $('#messages'),
    $message = $('#message'),
    socket = io.connect('/'),
    username = '';

  socket.on('message', function (data) {
    var $username = $('<span class="username"></span>').text(data.username);
    if (data.username == username) {
      $username.addClass('me');
    }
    var $message = $('<span class="message"></span>').text(data.message);
    $messages.append($('<li class="message"></li>').append($username).append(': ').append($message));
    scrollToBottom();
  });

  socket.on('join', function (data) {
    var $username = $('<span class="username"></span>').text(data.username);
    $messages.append($('<li class="join"></li>').append($username).append(' has joined the chatroom.'));
    scrollToBottom();
  });

  socket.on('leave', function (data) {
    var $username = $('<span class="username"></span>').text(data.username);
    $messages.append($('<li class="leave"></li>').append($username).append(' has left chatroom.'));
    scrollToBottom();
  });

  socket.on('username', function (data) {
    var $oldUsername = $('<span class="old-username"></span>').text(data.oldUsername);
    var $newUsername = $('<span class="new-username"></span>').text(data.newUsername);
    $messages.append($('<li class="username"></li>').append($oldUsername).append(' is now known as ').append($newUsername));
    scrollToBottom();
  });

  $('#send').click(function(event){
    var message = $message.val();
    if (message.length == 0) return;
    socket.emit('say', message);
    $message.val('');
    $message.focus();
    scrollToBottom();
  });

  var scrollToBottom = function(){
    $messages[0].scrollTop = $messages[0].scrollHeight;
  };

  $message.keyup(function(event){
    if (13 != event.keyCode) return;
    $('#send').click();
  }).focus();

  var changeUsername = function(){
    username = '';
    while (username.length == 0) {
      username = prompt("What is your name?");
    }
    socket.emit('username', username);
  }

  changeUsername();

  $('#change-username').click(function(event){
    event.preventDefault();
    changeUsername();
  });

  $(window).unload(function(event){
    socket.emit('disconnect', '');
  });
});