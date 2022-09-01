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

const notificationsRouter = require('./routes/notifications.js');
app.use('/notifications', notificationsRouter);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

io.on('connection', socket => {
    async function gameUpdate(game_id){
        const game = await db.getGame(game_id);
        io.emit('bet_update', JSON.stringify(game));
    }

    async function accountUpdateLocal(username){
        const acc = await db.getAccount(username);
        socket.emit('account_update', JSON.stringify(acc));
    }

    async function gameUpdateLocal(game_id, username){
        const game = await db.getGame(game_id);
        const bet = await db.getBetsInGameConsolidated(game_id, username)
        socket.emit('bet_update', JSON.stringify({
            game, bet
        }));
    }

    async function betUpdate(username, game_id){
        const bet = await db.getBetsInGameConsolidated(game_id, username);
        socket.emit('consolidated_bet', JSON.stringify(bet));
    }

    socket.on('bet', async data => {
        const bet = JSON.parse(data);
        const {username, game_id, amount, side} = bet;
        try{
            await db.placeBet(game_id, username, amount, side);
            await gameUpdate(game_id);
            await accountUpdateLocal(username);
            await betUpdate(username);
        }
        catch(err){
            socket.emit('bet_rejected', err.message);
        }
        
    });

    socket.on('fold', async data => {
        const bet = JSON.parse(data);
        const {username, game_id} = bet;

        try{
            await db.foldBet(game_id, username);
        }
        catch(err){
            socket.emit('bet_rejected', err.message);
        }
    });

    socket.on('get_bet_data', async (data) => {
        const {username, game_id} = JSON.parse(data);
        await gameUpdateLocal(game_id, username);
    });
});