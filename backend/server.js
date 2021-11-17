const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');

//Required so react works on the front-end.
const react = require('react');
const reactDom = require('react-dom');

const io = socketio(server);

app.use(express.static('frontend'));
app.use(express.static('node_modules'));

const Bank = require('./js/bank');
const Bet = require('./js/bet');
const Game = require('./js/game');

const bank = new Bank();
const game = new Game();

let clients = new Map();

bank.currencySymbol = "mk";

function bankUpdate(socket){
    socket.emit('bank_update', JSON.stringify({
        circulation : bank.circulation,
        currencySymbol : bank.currencySymbol,
        supply : bank.supply
    }));
}

function gameUpdate(socket){
    socket.emit('game_update', JSON.stringify({
        pool : game.pool, 
        minBet : game.minBet,
        name : game.name
    }));
}

function accountUpdate(socket){
    const acc = bank.accounts.get(socket.id);

    socket.emit('account_update', JSON.stringify({
        balance : acc.balance,
        debt : acc.debt,
        profit : acc.profit
    }));
}

io.on('connection', socket =>{
    clients.set(socket.id, socket);

    console.log("New connection! ID: " + socket.id);
    //Send current game state to new connection.

    gameUpdate(socket);
    bank.addAccount(socket.id);

    accountUpdate(socket);
    bankUpdate(io);

    socket.on('disconnect', () => {
        //Delete account associated with this socket. Leave game pool intact.
        const acc = bank.accounts.get(socket.id);
        
        bank.circulation -= acc.balance;
        const bet = game.placedBets.get(socket.id);

        if(bet){
            game.placedBets.delete(bet.id);
        }
        
        bank.accounts.delete(socket.id);

        bankUpdate(io);

        gameUpdate(io);

    });

    socket.on('place_bet', msg => {
        const data = JSON.parse(msg);
        const bet = new Bet(data.amount, data.side, data.id);


        game.placeBet(bet);
        bank.deposit(socket.id, -bet.amount);
        accountUpdate(socket);

        gameUpdate(io);
    });

    socket.on('fold', id => {
        let bet = game.placedBets.get(id);
        bet.folded = true;
    })

    socket.on('loan', amount => {
        const acc = bank.accounts.get(socket.id);

        if(acc){

            if(acc.debt >= bank.defaultIssueAmount) {
                return;
            }

            bank.loan(socket.id, amount);
            accountUpdate(socket);
            bankUpdate(io);
        }
        else{
            console.log("Account " + socket.id + " does not exist!");
        }
        
    });

    socket.on('pay_debt', amount => {
        bank.payDebt(socket.id, amount);

        bankUpdate(io);
        accountUpdate(socket);
    });

    socket.on('end_game', () =>{
        //When someone presses the end game button, all participants have to vote for the game to end.
        io.emit('end_game_request', socket.id);
    });

    socket.on('end_game_vote', data =>{
        const id = data.id;
        const vote = data.vote;

        console.log("Received vote to end the game (vote: " + vote + ", id: " + id);
    });

    socket.on('end_game_accepted', result => {
        let gameResult = game.end(result);

        //Deposit winning share to all winners.
        for(let winner of gameResult.winners){
            bank.deposit(winner.id, gameResult.poolShare);
        }


        //Update all accounts participating in the game.
        const participants = game.placedBets;
        for(let bet of participants.values()){
            const id = bet.id
            const socket = clients.get(id);

            if(!socket) {
                console.log("Bad socket ID! (" + id + ')');
                return;
            }

            
            //Shorten debt of all accounts instead if no one won.
            const acc = bank.accounts.get(id);
            if(gameResult.winners.length == 0){
                bank.circulation -= bet.amount;
                acc.debt -= bet.amount;
            }
            else{
                //Profit is not affected when paying debt.
                acc.setProfit();
            }
            
            
           accountUpdate(socket);
        }

        //Game bets can now be cleared.
        game.placedBets.clear();

        gameUpdate(io);
    });

    
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Server running on port '  + PORT));


