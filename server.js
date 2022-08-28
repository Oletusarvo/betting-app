const express = require('express');
const http = require('http');

const app = express();
app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(express.json());

const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

const gameListRouter = require('./routes/gamelist.js');
app.use('/gamelist', gameListRouter);

const signupRouter = require('./routes/signup.js');
app.use('/signup', signupRouter);

const loginRouter = require('./routes/login.js');
app.use('/login', loginRouter);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));