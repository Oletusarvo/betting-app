const {server, io} = require('./serverConfig.js');
const {Database, Game, Bank} = require('./models/db.js');

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

io.on('connection', socket => {
    console.log('New connection!');

    socket.on('receive_game', async game_id => {
        try{
            const db = new Database();
            const game = await db.getGame(game_id);
            socket.emit('send_game', JSON.stringify(game));
        }
        catch(err){
            socket.emit('error', err.message);
        }
    });

    socket.on('receive_balance', async data => {
        try{
            const {username} = data;
            const bank = new Bank();
            const acc = await bank.getAccount(username);
            socket.emit('send_balance', JSON.stringify(acc.balance));
        }
        catch(err){
            socket.emit('error', err.message);
        }
    });

    socket.on('send_bet', async data => {
        const bet = JSON.parse(data);
        const game = await (new Game()).load(bet.game_id);

        try{
            await game.placeBet(bet);
            io.emit('receive_game', JSON.stringify(game.game));
        }
        catch(err){
            socket.emit('error', err.message);
        }
    });
});

io.on('disconnect', () => console.log('Socket disconnected!'));
