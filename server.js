const {server, io} = require('./serverConfig.js');
const {Database, Game, Bank} = require('./models/db.js');

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

io.on('connection', socket => {
    console.log('New connection!');

    socket.on('bet_place', async data => {
        const {username, amount, side, game_id} = JSON.parse(data);
        try{
            const game = new Game();
            await game.load(game_id);
            await game.placeBet({
                username, amount, side, game_id
            });
            io.emit('game_update', JSON.stringify(game.data()));

            const bet = await game.getBet(username);
            socket.emit('bet_update', JSON.stringify(bet));
        }
        catch(err){
            socket.emit('error', err.message);
        }
    });

    socket.on('game_get', async game_id => {
        try{
            const game = new Game();
            await game.load(game_id);
            socket.emit('game_update', JSON.stringify(game.data()));
        }
        catch(err){
            socket.emit('error', JSON.stringify({
                type : "Game error",
                message : err.message,
            }));
        }
    });

    socket.on('bet_get', async data => {
        const {username, game_id} = JSON.parse(data);
        try{
            const game = new Game();
            await game.load(game_id);
            const bet = await game.getBet(username);
            socket.emit('bet_update', JSON.stringify(bet));
        }
        catch(err){
            socket.emit('error', JSON.stringify({
                type : 'Bet error',
                message : err.message
            }));
        }
    });
});

io.on('disconnect', () => console.log('Socket disconnected!'));
