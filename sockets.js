function listen(io) {
  // Set up namespaces
  const charactersNamespace = io.of('/characters');
  const campaignsNamespace = io.of('/campaigns');
  // const sessionsNamespace = io.of('/sessions');
  // const messagesNamespace = io.of('/messages');

  charactersNamespace.on('connection', socket => {
    console.log(`client ${socket.id} connected`);

    socket.on('joinRoom', room => {
      console.log('join', room);
      socket.join(room);
      socket.to(room).emit('message', `client ${socket.id} joined character room ${room}`);
    });

    socket.on('leaveRoom', room => {
      console.log('leave', room);
      socket.leave(room);
      socket.to(room).emit('message', `client ${socket.id} left character room ${room}`);
    });

    socket.on('changes', ({ room, type, args }) => {
      console.log('changes', { room, type, args });
      socket.to(room).emit('updates', { type, args });
    });

    socket.on('message', ({ room, message }) => {
      console.log('message', message);
      socket.to(room).emit('message', message);
    });

    socket.on('disconnect', reason => {
      console.log(`client ${socket.id} disconnected: ${reason}`);
    });
  });

  campaignsNamespace.on('connection', socket => {
    console.log(`client ${socket.id} connected`);

    socket.on('joinRoom', room => {
      console.log('join', room);
      socket.join(room);
      socket.to(room).emit('message', `client ${socket.id} joined campaign room ${room}`);
    });

    socket.on('leaveRoom', room => {
      console.log('leave', room);
      socket.leave(room);
      socket.to(room).emit('message', `client ${socket.id} left campaign room ${room}`);
    });

    socket.on('changes', ({ room, type, args }) => {
      console.log('changes', { room, type, args });
      socket.to(room).emit('updates', { type, args });
    });

    socket.on('message', ({ room, message }) => {
      console.log('message', message);
      socket.to(room).emit('message', message);
    });

    socket.on('disconnect', reason => {
      console.log(`client ${socket.id} disconnected: ${reason}`);
    });
  });
}

module.exports = {
  listen,
};
