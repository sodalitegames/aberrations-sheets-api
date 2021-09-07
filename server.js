const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception. Shutting down...');
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(`db connection successful`));

const port = process.env.PORT || 2341;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection. Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
