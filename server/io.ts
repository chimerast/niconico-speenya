import socketio, { Socket } from 'socket.io';
import consola from 'consola';

export const io = socketio();

function logSocketEvent(socket: Socket, event: string) {
  consola.log(
    `[${new Date().toISOString()}] socket.io - ${event}: id=${socket.id}, remoteAddress=${socket.request.connection.remoteAddress}`
  );
}

io.on('connection', (socket) => {
  logSocketEvent(socket, 'connection');

  socket.on('disconnect', () => {
    logSocketEvent(socket, 'disconnect');
  });
});
