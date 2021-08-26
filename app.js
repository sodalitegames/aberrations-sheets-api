const express = require('express');
const morgan = require('morgan');

const playerRouter = require('./routers/playerRouter');
const sheetRouter = require('./routers/sheetRouter');

const AppError = require('./utils/errorClass');
const globalErrorHandler = require('./utils/errorHandler');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

// TODO: CREATE REUSABLE GROUPS OF PARAMS FOR THE YAML FILE
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

// MIDDLEWARE
// TODO: FIGURE OUT WHY NODE_ENV DOESN'T SEEM TO BE GETTING SET
if (process.env.NODE_ENV === 'development' || true) {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   // run code...
//   console.log(req.params);
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// MOUNT ROUTERS
app.use('/v1/players', playerRouter);
// TODO: CREATE A MIDDLEWARE THAT CHECKS THE SHEETTYPE
// so i dont have to keep repeating myself all over
app.use('/v1/:sheetType', sheetRouter);

// CATCH ALL ROUTE FOR 404 ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} does not exist`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// EXPORT APP
module.exports = app;
