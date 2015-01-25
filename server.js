var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var extend = require('util')._extend;

require('console-stamp')(console, '[HH:MM:ss.l]');

var refererCheck = function (req, res, next) {
  if (req.get('Referer')) {
    next();
  } else {
    res.status(404).end();
  }
};

app.get('/comment/:comment', refererCheck, function (req, res) {
  var msg = extend({ body: req.param('comment') }, req.query);
  console.log('comment: ' + JSON.stringify(msg));
  io.emit('comment', msg);
  res.end();
});

app.get('/comment', refererCheck, function (req, res) {
  var msg = extend({}, req.query);
  console.log('comment: ' + JSON.stringify(msg));
  io.emit('comment', msg);
  res.end();
});

app.get('/like', refererCheck, function (req, res) {
  var msg = extend({}, req.query);
  console.log('like: ' + JSON.stringify(msg));
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
