const express = require('express');
const morgan = require('morgan');

const routers = require('./routers');

const AppError = require('./utils/errorClass');
const globalErrorHandler = require('./utils/errorHandler');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

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
app.use('/v1/log', routers.logRouter);

// CATCH ALL ROUTE FOR 404 ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} does not exist`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// EXPORT APP
module.exports = app;
