var app = require('express').createServer()
  , io = require('socket.io').listen(app),
  port = process.env.PORT || 3000;

app.listen(port);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/index.html');
});

io.sockets.on('connection', function (socket) {
  var username = null;

  socket.on('username', function(newUsername){
    var oldUsername = username;
    username = newUsername;
    if (null === oldUsername) {
      socket.emit('join', {username: username});
    } else {
      socket.emit('username', {oldUsername: oldUsername, newUsername: username});
    }
  });

  socket.on('say', function(message){
    socket.emit('message', {username: username, message: message});
  });
});