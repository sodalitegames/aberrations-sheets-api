const express = require('express');
const morgan = require('morgan');

const routers = require('./routers');

const AppError = require('./utils/errorClass');
const globalErrorHandler = require('./utils/errorHandler');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

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
//   next();
// })

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// MOUNT ROUTERS
app.use('/v1/players', routers.playerRouter);

// TODO: POTENTIALLY COMBINE THE FOLLOWING TWO ROUTES INTO ONE WITH A ':SHEETTYPE' PARAM
app.use('/v1/characters', routers.charSheetRouter);
app.use('/v1/campaigns', routers.campSheetRouter);

app.use('/v1/:sheetType/:sheetId/log', routers.logRouter);

// CATCH ALL ROUTE FOR 404 ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} does not exist`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// EXPORT APP
module.exports = app;
