var express = require('express'),
  app = express.createServer(),
  jade = require('jade'),
  io = require('socket.io').listen(app),
  port = process.env.PORT || 3000,
  chatrooms = [];

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('view options', { pretty: true });
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.render('chatroom');
});

// Run!!!
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

io.configure(function() { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 5); 
});

io.sockets.on('connection', function (socket) {
  var username = null;

  // Change username (or join)
  socket.on('username', function(newUsername){
    var oldUsername = username;
    username = newUsername;
    if (null === oldUsername) {
      io.sockets.emit('join', {username: username});
    } else {
      io.sockets.emit('username', {oldUsername: oldUsername, newUsername: username});
    }
  });

  // Say something
  socket.on('say', function(message){
    io.sockets.emit('message', {username: username, message: message});
  });

  // Leave
  socket.on('disconnect', function () {
    io.sockets.emit('leave', {username: username});
  });
});