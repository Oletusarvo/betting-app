const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use((req, res, next) => {req.io = io; next(); });

const gamesRouter = require('./routes/games.js');
app.use('/games', gamesRouter);

const accountsRouter = require('./routes/accounts.js');
app.use('/accounts', accountsRouter);

const betsRouter = require('./routes/bets.js');
app.use('/bets', betsRouter);

const signupRouter = require('./routes/signup.js');
app.use('/signup', signupRouter);

const loginRouter = require('./routes/login.js');
app.use('/login', loginRouter);

const notificationsRouter = require('./routes/notifications.js');
app.use('/notifications', notificationsRouter);

const coinsRouter = require('./routes/coins.js');
app.use('/coins', coinsRouter);



module.exports = {io, server};