const {server, io} = require('./serverConfig.js');
//const {database, game, bank} = require('./models/db.js');
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
const {SideGame, LottoGame, Game, Account} = require('./utils/environment.js');
const db = require('./dbConfig');

io.on('connection', async socket => {
    console.log(`New connection!`);
    connectedUsers[socket.id] = socket;

    socket.on('join_room', async (msg, callback) => {
        const {game_id, username} = msg;

        socket.join(game_id);
        const {type} = await db('games').where({game_id}).first();
        const game = Game.createGame(type);
        await game.load(game_id);
        
        callback({
            newGame: game.data,
            newBet: game.getBet(username),
        });
    });

    socket.on('leave_room', game_id => {
        socket.leave(game_id);
    });

    socket.on('bet_place', async (bet, callback) => {
        try{
            const {game_id, username, type} = bet;
            const game = Game.createGame(type);
            await game.load(game_id);
            await game.placeBet(bet);

            socket.broadcast.emit('game_update', game.data);

            const {balance} = await db('accounts').where({username}).first();
            const newBet = game.getBet(username);

            callback({
                game: game.data,
                acc: {balance, username},
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
            const {type} = await db('games').where({game_id}).first();
            const game = Game.createGame(type);
            await game.load(game_id);
            await game.close(side);

            socket.broadcast.emit('account_update');
            const {balance} = await db('accounts').where({username}).first();
            const gameList = await db('games');

            
            callback({
                acc: {balance, username}, 
                gameList,
            });
        }
        catch(err){
            socket.emit('error', err.message);
        }
        
    });

    socket.on('coins_generate', async (data, callback) => {
        const {username, amount} = data;
        
        try{
            const acc = new Account();
            await acc.load(username);
            await acc.deposit(amount);
            const {balance} = acc.data;

            callback({username, balance});
        }
        catch(err){
            console.log(err.message);
        }
    });

    socket.on('notes_get', async (username, callback) => {
        try{
            const notes = [];
            callback(notes);
        }
        catch(err){
            socket.emit('error', err.message);
        }
    });

    socket.on('account_get', async (username, callback) => {
        try{
            const {balance} = await db('accounts').where({username}).first();
            const acc = {username, balance};
            //const notes = await database.getNotifications(username);
            callback({user: acc, notes: []});
        }
        catch(err){
            console.log(err);
        }
    });

    socket.on('bet_get', async (data, callback) => {
        const {username, game_id} = data;
        try{
            const {type} = await db('games').where({game_id});
            const game = Game.createGame(type);
            await game.load(game_id);
            const bet = game.getBet(username);
            callback(bet);
        }
        catch(err){
            console.log(err.message);
        }
    });
});

io.on('disconnect', () => console.log('Socket disconnected!'));
