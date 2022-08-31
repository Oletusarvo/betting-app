const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const db = require('./models/db');

const app = express();
app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(express.json());

const gamesRouter = require('./routes/games.js');
app.use('/games', gamesRouter);

const signupRouter = require('./routes/signup.js');
app.use('/signup', signupRouter);

const loginRouter = require('./routes/login.js');
app.use('/login', loginRouter);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

io.on('connection', socket => {
    console.log(`New connection!`);

    function gameUpdate(game){
        io.emit('bet_update', JSON.stringify(game));
    }

    function gameUpdateLocal(game){
        socket.emit('bet_update', JSON.stringify(game));
    }

    socket.on('bet', async data => {
        const bet = JSON.parse(data);
        const {username, game_id, amount, side} = bet;

        const game = await db.getGame(game_id);

        try{
            await db.placeBet(game_id, username, amount, side);
            gameUpdate(game);
        }
        catch(err){
            socket.emit('bet_rejected', err.message);
        }
        
    });

    socket.on('get_bet_data', async id => {
        const game = await db.getGame(id);
        gameUpdateLocal(game);
    });
});