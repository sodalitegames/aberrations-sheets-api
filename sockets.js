function listen(io) {
  // Set up namespaces
  const charactersNamespace = io.of('/characters');
  const campaignsNamespace = io.of('/campaigns');
  const playersNamespace = io.of('/players');

  charactersNamespace.on('connection', socket => {
    console.log(`client ${socket.id} connected: namespace:character`);

    socket.on('joinRoom', room => {
      console.log('character', 'join', room);
      socket.join(room);
      socket.to(room).emit('message', `client ${socket.id} joined character room ${room}`);
    });

    socket.on('leaveRoom', room => {
      console.log('character', 'leave', room);
      socket.leave(room);
      socket.to(room).emit('message', `client ${socket.id} left character room ${room}`);
    });

    socket.on('changes', ({ sheet, room, type, args }) => {
      console.log('character', 'changes', { sheet, room, type, args });
      socket.to(room).emit('updates', { sheet, room, type, args });
    });

    socket.on('message', ({ room, message }) => {
      console.log('character', 'message', message);
      socket.to(room).emit('message', message);
    });

    socket.on('disconnect', reason => {
      console.log(`client ${socket.id} disconnected: namespace:character: ${reason}`);
    });
  });

  campaignsNamespace.on('connection', socket => {
    console.log(`client ${socket.id} connected: namespace:campaign`);

    socket.on('joinRoom', room => {
      console.log('campaign', 'join', room);
      socket.join(room);
      socket.to(room).emit('message', `client ${socket.id} joined campaign room ${room}`);
    });

    socket.on('leaveRoom', room => {
      console.log('campaign', 'leave', room);
      socket.leave(room);
      socket.to(room).emit('message', `client ${socket.id} left campaign room ${room}`);
    });

    socket.on('changes', ({ sheet, room, type, args }) => {
      console.log('campaign', 'changes', { sheet, room, type, args });
      socket.to(room).emit('updates', { sheet, room, type, args });
    });

    socket.on('message', ({ room, message }) => {
      console.log('campaign', 'message', message);
      socket.to(room).emit('message', message);
    });

    socket.on('disconnect', reason => {
      console.log(`client ${socket.id} disconnected: namespace:campaign: ${reason}`);
    });
  });

  playersNamespace.on('connection', socket => {
    console.log(`client ${socket.id} connected: namespace:player`);

    socket.on('joinRoom', room => {
      console.log('player', 'join', room);
      socket.join(room);
      socket.to(room).emit('message', `client ${socket.id} joined player room ${room}`);
    });

    socket.on('leaveRoom', room => {
      console.log('player', 'leave', room);
      socket.leave(room);
      socket.to(room).emit('message', `client ${socket.id} left player room ${room}`);
    });

    socket.on('changes', ({ sheet, room, type, args }) => {
      console.log('player', 'changes', { sheet, room, type, args });
      socket.to(room).emit('updates', { sheet, room, type, args });
    });

    socket.on('message', ({ room, message }) => {
      console.log('player', 'message', message);
      socket.to(room).emit('message', message);
    });

    socket.on('disconnect', reason => {
      console.log(`client ${socket.id} disconnected: namespace:player: ${reason}`);
    });
  });
}

module.exports = {
  listen,
};
