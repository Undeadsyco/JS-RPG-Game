import 'dotenv/config';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoose from 'mongoose';

import routes from './routes/main';
import passwordRoutes from './routes/password';
import secureRoutes from './routes/secure';

const app = express();
const PORT = process.env.PORT || 5000;

const { MONGODB } = require('./config');

// updating express settings
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(passport.initialize());

// require auth file
require('./auth/auth');

app.get('/game.html', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json(req.user);
});

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.send(path.join(__dirname, '/index.html'));
});

// setting up routes
app.use('/', routes);
app.use('/', passwordRoutes);
app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

// handling unspecified routes
app.use((req, res) => {
  res.status(404).json({ message: '404 not found', status: 404 });
});

// handle errors
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ error: error.message, status: 500 });
});

mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
  console.log('database conneted');
  return app.listen({ port: PORT });
}).then(() => {
  console.log(`server is running on port: ${process.env.PORT}`);
}).catch((err) => {
  console.log(err);
});
