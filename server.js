var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var extend = require('util')._extend;
var morgan = require('morgan');

require('console-stamp')(console, '[HH:MM:ss.l]');

app.use(morgan('combined'));

app.get('/comment/:comment', function (req, res) {
  var msg = extend({ body: req.param('comment') }, req.query);
  io.emit('comment', msg);
  res.end();
});

app.get('/comment', function (req, res) {
  var msg = extend({}, req.query);
  io.emit('comment', msg);
  res.end();
});

app.get('/like', function (req, res) {
  var msg = extend({}, req.query);
  io.emit('like', msg);
  res.end();
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  console.log('connected: ' + socket.request.connection.remoteAddress);

  socket.on('disconnect', function () {
    console.log('disconnected: ' + socket.request.connection.remoteAddress);
  });
});

http.listen(process.env.PORT || 2525);
