const {server, io} = require('./serverConfig.js');
const {database, game, bank} = require('./models/db.js');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if(token && jwt.verify(token, process.env.SERVER_TOKEN_SECRET, (err, user) => {
        if(err){
            next(new Error(`Unauthorized`));
        }
        else{
            next();
        }
    }))
    
    next(new Error('authentification missing'));
    
});

const connectedUsers = [];

io.on('connection', async socket => {
    console.log(`New connection!`);
    connectedUsers[socket.id] = socket;

    socket.on('join_room', async (msg, callback) => {
        const {game_id, username} = msg;

        socket.join(game_id);

        await game.load(game_id);
        const bet = await game.getBet(username);

        callback({
            newGame: game.data(),
            newBet: bet
        });
    });

    socket.on('leave_room', game_id => {
        socket.leave(game_id);
    });

    socket.on('bet_place', async (bet, callback) => {
        try{
            await game.load(bet.game_id);
            await game.placeBet(bet);
            const acc = await bank.getAccount(bet.username);
            const newBet = await game.getBet(bet.username);
            
            const gameData = game.data();
            socket.broadcast.to(bet.game_id).emit('game_update', gameData);

            callback({
                game: gameData,
                acc,
                newBet
            });
        }
        catch(err){
            socket.emit('bet_error', err.message);
        }
    });

    socket.on('game_close', async (msg, callback) => {

        try{
            const {game_id, side, username} = msg;
            await game.load(game_id);
            await game.close(side);

            const noti = await database.getNotifications();

            const acc = await bank.getAccount(username);
            const gameList = await database.getGamesByUser(username);

            socket.broadcast.emit('account_update');
            io.emit('noti_update', noti);

            callback({
                acc, gameList
            });
        }
        catch(err){
            socket.emit('error', err.message);
        }
        
    });

    socket.on('coins_generate', async (data, callback) => {
        const {username, amount} = data;
        
        try{
            await bank.deposit(username, amount);
            const user = await bank.getAccount(username);
            callback(user);
        }
        catch(err){
            console.log(err.message);
        }
    });

    socket.on('noti_get', async (username, callback) => {
        try{
            const noti = await database.getNotifications(username);
            await database.deleteNotifications(username);
            callback(noti);
        }
        catch(err){
            socket.emit('error', err.message);
        }
    });

    socket.on('account_get', async (username, callback) => {
        try{
            const acc = await bank.getAccount(username);
            callback(acc);
        }
        catch(err){
            console.log(err);
        }
    });
});

io.on('disconnect', () => console.log('Socket disconnected!'));
