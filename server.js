const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

process.on('uncaughtException', err => {
  console.log(err);
  console.log('Uncaught Exception. Shutting down...');
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(`db connection successful`));

const port = process.env.PORT || 2341;

// Set up socket.io connections
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

io.on('connection', function (socket) {
  console.log('A user connected');

  socket.on('joinRoom', roomName => {
    socket.join(roomName);
    socket.to(roomName).emit('message', 'A new react client has joined this room');
    console.log('A react client has joined room:', roomName);
  });

  socket.on('disconnect', function () {
    console.log('A user diconnected');
  });
});

const server = httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err);
  console.log('Unhandled Rejection. Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
