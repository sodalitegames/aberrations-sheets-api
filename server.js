const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

const sockets = require('./sockets');

// Uncaught Exceptions
process.on('uncaughtException', err => {
  console.log(err);
  console.log('Uncaught Exception. Shutting down...');
  process.exit(1);
});

const expressServer = require('./app');

dotenv.config({ path: './config.env' });

// Connect to mongodb via mongoose connection
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(`db connection successful`));

const port = process.env.PORT || 2341;

// Create http server using express server
const httpServer = createServer(expressServer);

// Create and attach socket.io server to http server
const socketServer = new Server(httpServer, {
  cors: {
    origins: [process.env.SOCKET_CLIENT, process.env.SOCKET_CLIENT_STAGING],
    allowedHeaders: ['socket-header-secret'],
    credentials: true,
  },
});

// Load the http server with attached socket.io server
const server = httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

// Register all socket.io connections
sockets.listen(socketServer);

// Unhandled Rejections
process.on('unhandledRejection', err => {
  console.log(err);
  console.log('Unhandled Rejection. Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
