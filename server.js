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
            socket.user = user;
            next();
        }
    }))
    
    next(new Error('authentification missing'));
});

const Account = require('./utils/account');
const Game = require('./utils/game');
const db = require('./dbConfig');
const notifier = new (require('./utils/notifier.js'));

io.on('connection', async socket => {
    notifier.registerSocket(socket.user.username, socket);

    socket.on('disconnect', () => notifier.unregisterSocket(socket.user.username));
    
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

            const notes = game.getNotes();
            for(const note of notes){
                console.log('Sending notes...');
                await notifier.send(note);
            }

            socket.broadcast.emit('game_update', game.data);
            
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

    socket.on('game_end', async (msg, callback) => {

        try{
            const {id, side, username} = msg;
            const game = await Game.loadGame(id);
            await game.close(side);

            const notes = game.getNotes();
            for(const note of notes){
                await notifier.send(note);
            }

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

    socket.on('game_toggle_close', async (id, callback) => {
        try{
            const game = await db('games').where('id', id).first();
            const newState = !game.closed;
            await db('games').where('id', id).update('closed', newState);
            callback(newState);
        }
        catch(err){
            console.log(err.message);
        }
    });

    socket.on('followers_get', async (username, callback) => {
        try{
            const followers = await db('follow_data').where('followed', username).pluck('followed_by');
            callback(followers);
        }
        catch(err){
            console.log(err.message);
        }
    });

    socket.on('following_get', async (username, callback) => {
        try{
            const following = await db('follow_data').where('followed_by', username).pluck('followed');
            callback(following);
        }
        catch(err){
            console.log(err.message);
        }
    });

    socket.on('coins_generate', async (data, callback) => {
        const {username, amount} = data;
        
        try{
            if(username === 'demo') throw new Error('Demotili ei voi luoda noppia!');

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

    socket.on('note_delete', async (id, res) => {
        try{
            await db('notes').where({id}).del();
            res(0);
        }
        catch(err){
            res(1);
        }
    });

    socket.on('notes_seen', async (username, res) => {
        try{
            await db.select('seen').from('notes').where('username', username).update({seen: true});
            res(0);
        }
        catch(err){
            res(1);
        }
        
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
    });

    socket.on('follow', async (follower, followed, callback) => {
        try{
            const isFollowing = (await db('follow_data').where({followed, followed_by: follower})).length; //Hacky stuff. Have to figure out a more elegant way.
            if(isFollowing) {
                await db('follow_data').where({followed_by: follower, followed}).del();
            }
            else{
                await db('follow_data').insert({
                    followed,
                    followed_by: follower
                });
                
                const note = {
                    game_title: '',
                    username: followed,
                    message: `${follower} seurasi sinua!`,
                };
    
                notifier.send(note);
                socket.broadcast.emit('notes_update', [note]);
            }
        }
        catch(err){
            callback(err.message);
        }
    });

    socket.on('unfollow', async (followed_by, followed, callback) => {
        try{
            await db('follow_data').where({followed, followed_by}).del();
            callback();
        }
        catch(err){
            console.log(err.message);
        }
        
    })

    socket.on('get_user_data', async (currentUser, username, callback) => {
        const numBets = (await db('games').where({created_by: username})).length;
        const followData = await db('follow_data').where({followed: username}).orWhere({followed_by: username});
        const numFollowers = followData.reduce((acc, cur) => acc += cur.followed === username, 0);
        const numFollowing = followData.reduce((acc, cur) => acc += cur.followed_by === username, 0);
        const isFollowing = (await db('follow_data').where({followed: username, followed_by: currentUser})).length;

        callback({
            numBets,
            numFollowers,
            numFollowing,
            isFollowing,
        })
    });

    socket.on('is_following', async (followed_by, followed, callback) => {
        const isFollowing = (await db('follow_data').where({followed, followed_by})).length;
        callback(isFollowing);
    });
});

