const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const playerRouter = require('./routers/playerRouter');
const sheetRouter = require('./routers/sheetRouter');

const sheetController = require('./controllers/sheetController');
const authController = require('./controllers/authController');

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

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});

app.use('/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// Serve static files
// app.use(express.static(`${__dirname}/public`));

// Test middleware
// app.use((req, res, next) => {
//   // run code...
//   console.log(req.params);
//   next();
// });

// Setting request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// MOUNT ROUTERS
app.use('/v1/players', playerRouter);
// TODO: CREATE A MIDDLEWARE THAT CHECKS THE SHEETTYPE
// so i dont have to keep repeating myself all over
app.use('/v1/:sheetType', authController.requireAuthentication, sheetController.checkSheetType, sheetRouter);

// CATCH ALL ROUTE FOR 404 ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} does not exist`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// EXPORT APP
module.exports = app;
