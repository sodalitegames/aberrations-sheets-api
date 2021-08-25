const express = require('express');
const morgan = require('morgan');

const router = require('./routes/routes');

const AppError = require('./utils/errorClass');
const globalErrorHandler = require('./utils/errorHandler');

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   // run code...
//   next();
// })

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// MOUNT ROUTERS
app.use('/v1', router);

// CATCH ALL ROUTE FOR 404 ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} does not exist`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// EXPORT APP
module.exports = app;
