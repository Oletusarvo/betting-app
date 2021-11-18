const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const FS = require('fs');
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

//Store socket ids of connected usernames.
let clients = new Map();
let sockets = new Map(); //Temporarily map usernames to sockets until I figure out a better way to do things.

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

    FS.writeFile("data/data.json", JSON.stringify(game), (err) => {if(err != null)console.log(err)});
}

function accountUpdate(socket){
    const username = clients.get(socket.id);
    const acc = bank.accounts.get(username);

    socket.emit('account_update', JSON.stringify({
        balance : acc.balance,
        debt : acc.debt,
        profit : acc.profit
    }));
}

function rejectLoan(amount, socket){
    socket.emit('loan_rejected', amount);
}

io.on('connection', socket =>{
    console.log("New connection! ID: " + socket.id);
    //Send current game state to new connection.

    socket.on('login', username => {

        const isLoggedIn = clients.get(socket.id);

        if(isLoggedIn){
            socket.emit('login_failure');
        }
        else{
            clients.set(socket.id, username);
            sockets.set(username, socket);

            const acc = bank.accounts.get(username);

            if(!acc){
                bank.addAccount(username);
            }
        
            accountUpdate(socket);
            bankUpdate(io);
            gameUpdate(socket);

            socket.emit('login_success', username);
        }
        
    });

    socket.on('disconnect', () => {
        //Delete account associated with this socket. Leave game pool intact.
        clients.delete(socket.id);
    });

    socket.on('place_bet', msg => {
        const data = JSON.parse(msg);
        const username = clients.get(socket.id);

        if(username == undefined) return;

        const bet = new Bet(data.amount, data.side, username);

        game.placeBet(bet);
        bank.deposit(username, -bet.amount);
        accountUpdate(socket);

        gameUpdate(io);
    });

    socket.on('fold', id => {
        const username = clients.get(socket.id);

        if(username == undefined) return;

        let bet = game.placedBets.get(username);
        bet.folded = true;
    });

    socket.on('loan', amount => {
        const username = clients.get(socket.id);

        if(username == undefined) return;

        const acc = bank.accounts.get(username);

        if(acc){

            if(acc.debt >= bank.defaultIssueAmount) {
                rejectLoan(amount, socket);
                return;
            }

            bank.loan(username, amount);
            accountUpdate(socket);
            bankUpdate(io);
        }
        else{
            console.log("Account " + socket.id + " does not exist!");
        }
        
    });

    socket.on('pay_debt', amount => {
        const username = clients.get(socket.id);

        if(username == undefined) return;

        bank.payDebt(username, amount);

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

        const username = clients.get(socket.id);

        if(username == undefined) return;
        
        let gameResult = game.end(result);

        //Deposit winning share to all winners.
        for(let winner of gameResult.winners){
            bank.deposit(winner.id, gameResult.poolShare);
        }


        //Update all accounts participating in the game.
        const participants = game.placedBets;
        for(let bet of participants.values()){
            const username = bet.id
            const socket = sockets.get(username);

            if(!socket) {
                console.log("Non-existent socket!");
                continue;
            }

            
            //Shorten debt of all accounts instead if no one won.
            const acc = bank.accounts.get(username);
            if(gameResult.winners.length == 0){
                bank.circulation -= bet.amount;
                acc.debt -= acc.debt > 0 ? bet.amount : 0;
            }
            else{
                //Profit is not affected when paying debt.
                acc.setProfit();
            }
            
            
           accountUpdate(socket);
        }

        //Game bets can now be cleared.
        game.placedBets.clear();

        bankUpdate(io);
        gameUpdate(io);
    });

    
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Server running on port '  + PORT));


