const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');

const playerRouter = require('./routers/player.router');
const sheetRouter = require('./routers/sheet.router');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/errorHandler');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Use swagger for API documentation
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

// Implement CORs
app.use(cors());
app.options('*', cors());

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'http:', 'data:'],
        scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
      },
    },
  })
);

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
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

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Test middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware function');
//   next();
// });

// Setting request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// MOUNT ROUTERS
app.use('/v1/players', playerRouter);
app.use('/v1/:sheetType', sheetRouter);

app.use('/', (req, res) => {
  res.status(200).render('root', {
    mode: process.env.NODE_ENV,
  });
});

// CATCH ALL ROUTE FOR ANY UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// EXPORT APP
module.exports = app;
