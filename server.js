var fs = require('fs')
var static = require('node-static');
var file = new(static.Server)();
var app = require('http').createServer(function (req, res) {
  file.serve(req, res);
});

var io = require('socket.io').listen(app);      


app.listen(8080);

var players = [];

var count = 0;

io.sockets.on('connection', function (socket) {
  socket.id = count;

  socket.emit('your_id',count);
  count++;
  socket.on('myevent', function(pos){
      players[socket.id] = {pos:pos};
      socket.broadcast.emit('update',players);
  });

  socket.on('disconnect',function(){
    players[socket.id] = null;
    socket.broadcast.emit('update',players);
  });
    
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}
