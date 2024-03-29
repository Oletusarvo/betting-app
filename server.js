const {server, io} = require('./serverConfig.js');
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
const {Game, Account} = require('./utils/environment.js');
const db = require('./dbConfig');

io.on('connection', async socket => {
    console.log(`New connection!`);

    socket.on('join_room', async (msg, callback) => {
        const {id, username} = msg;

        socket.join(id);
        const game = await Game.loadGame(id);
        
        callback({
            newGame: game.data,
            newBet: game.getBet(username),
        });
    });

    socket.on('leave_room', id => {
        socket.leave(id);
    });

    socket.on('bet_place', async (bet, callback) => {
        try{
            const {game_id, username} = bet;
            if(username === 'demo') throw new Error('Betting is disabled for the demo account!');

            const game = await Game.loadGame(game_id);
            await game.placeBet(bet);

            socket.broadcast.emit('game_update', game.data);
            game.sendNotes(io);
            const acc = await db.select('username', 'balance').from('users').where({username}).first();
            const newBet = game.getBet(username);

            callback({
                game: game.data,
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
            const {id, side, username} = msg;
            const game = await Game.loadGame(id);
            await game.close(side);

            game.sendNotes(io);
            socket.broadcast.emit('account_update');
            const acc = await db.select('username', 'balance').from('users').where({username}).first();
            const gameList = await db('games');
            
            callback({
                acc, 
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
            if(username === 'demo') throw new Error('Coins cannot be generated by the demo account!');

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
        if(username === 'demo') return;

        try{
            const notes = await db('notes').where({username});
            callback(notes);
        }
        catch(err){
            socket.emit('error', err.message);
        }
    });

    socket.on('note_delete', async id => {
        await db('notes').where({id}).del();
    });

    socket.on('notes_seen', async notes => {
        const ids = notes.map(note => note.id);
        await db.select('seen').from('notes').whereIn('id', ids).update({seen: true});
    });

    socket.on('account_get', async (username, callback) => {
        try{
            const acc = await db.select('username', 'balance').from('users').where({username}).first();
            callback({user: acc, notes: []});
        }
        catch(err){
            console.log(err);
        }
    });

    socket.on('bet_get', async (data, callback) => {
        const {username, id} = data;
        if(username === 'demo') return;
        
        try{
            const game = await Game.loadGame(id);
            const bet = game.getBet(username);
            callback(bet);
        }
        catch(err){
            console.log(err.message);
        }
    });

    socket.on('users_get', async callback => {
        const users = await db.select('username').from('users').orderBy('username', 'asc');
        callback(users);
    });

    socket.on('currency_get', (callback) => {
        const cur = require('./currencyfile');
        callback(cur);
    })
});

io.on('disconnect', () => console.log('Socket disconnected!'));
