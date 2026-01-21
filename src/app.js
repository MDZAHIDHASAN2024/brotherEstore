const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const creareError = require('http-errors');
const morgan = require('morgan');
const { userRouter } = require('./routes/userRouter');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const seedRouter = require('./routes/seedRouter');
const { errorResponse } = require('./controllers/responseController');
const { authRouter } = require('./routes/authRouter');

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 15,
  message: 'Too many requiest , pls try again later',
});

app.use(cookieParser());
app.use(helmet());
app.use(rateLimiter);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/seed', seedRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'home page',
  });
});

//client error handle
app.use((req, res, next) => {
  next(creareError(404, 'Route not found'));
});
//server error handle
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
