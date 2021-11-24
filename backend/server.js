const express       = require('express');
const http          = require('http');
const path          = require('path');
const socketio      = require('socket.io');
const Bet           = require('./js/bet');
const Bank          = require('./js/bank');
const Game          = require('./js/game');
const db            = require('../models/db');

const fs            = require('fs');

const reviver       = require('./js/reviver');
const replacer      = require('./js/replacer');

let bank = new Bank();
let game = new Game();


const clients = new Map();
const sockets = new Map();


//Required so react works on the front-end.
const react         = require('react');
const reactDom      = require('react-dom');

const bankDataLoc   = path.join(__dirname, 'data', 'bankState.json');
const gameDataLoc   = path.join(__dirname, 'data', 'gameState.json');

function loadGameData(){

    //TODO: If this returns nothing, add the records into the database.
    return db.getGameData();
}

function loadBankData(){
    return db.getBankData();
}

async function saveBankData(){
    return await db.updateBankData(JSON.stringify(bank, replacer));
}

async function saveGameData(){
    return await db.updateGameData(JSON.stringify(game, replacer));
}

function saveState(){
    db.updateBankData(JSON.stringify(bank, replacer)).then(console.log("bank state saved."));
    db.updateGameData(JSON.stringify(game, replacer)).then(console.log("game state saved."));
}

function bankUpdate(socket){
    socket.emit('bank_update', JSON.stringify({
        circulation : bank.circulation,
        currencySymbol : bank.currencySymbol
    }));
}

function hasToCallUpdate(socket){
    socket.emit('has_to_call', amount);
}

function gameUpdate(socket){
    socket.emit('game_update', JSON.stringify({
        pool : game.pool, 
        minBet : game.minBet,
        name : game.name
    }));
}

function accountUpdate(username, socket){
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

db.get().then(data => {
    if(data.length == 0){
        db.add({game_data: JSON.stringify(game, replacer), bank_data: JSON.stringify(bank, replacer)});         
    }

    db.getGameData().then( data => {
        if(data.length != 0){
            game = JSON.parse(data[0].game_data, reviver);
            console.log("Game state loaded.")
        }
        else{
            game = new Game();
        }
    })
    .then(
        db.getBankData().then( data => {
            if(data.length != 0){
                bank = JSON.parse(data[0].bank_data, reviver);
                console.log("Bank state loaded.");
            }
            else{
                bank = new Bank();
            }
    
            bank.currencySymbol = "mk";
        })
    );
});

const app           = express();
const server        = http.createServer(app);
const io            = socketio(server);

app.use(express.static('frontend'));
app.use(express.static('node_modules'));



io.on('connection', socket =>{
    console.log("New connection! ID: " + socket.id);
    //Send current game state to new connection.
    socket.on('login', msg => {
        const message = JSON.parse(msg);
        const username = message.from;
        
        if(username == undefined) return;

        clients.set(socket.id, username);
        sockets.set(username, socket);

        const acc = bank.accounts.get(username);

        if(!acc){
            bank.addAccount(username);
        }
        
        //acc.isLoggedIn = true;
        socket.emit('login_success', username);

        accountUpdate(username, socket);
        bankUpdate(io);
        gameUpdate(socket);
        
        saveState();
    });

    socket.on('logout', msg => {
        const message = JSON.parse(msg);
        sockets.delete(message.from);

        const acc = bank.accounts.get(message.from);
        acc.isLoggedIn = false;

        socket = sockets.get(message.from);
        socket.emit('logout_success');
    });

    socket.on('disconnect', () => {
        //Delete account associated with this socket. Leave game pool intact.
        const username = clients.get(socket.id);
        clients.delete(socket.id);
        sockets.delete(username);
    });

    socket.on('place_bet', msg => {
        const message = JSON.parse(msg);
        const username = message.from;

        if(username == undefined) return;

        const bet = new Bet(message.data.amount, message.data.side, message.from);

        game.placeBet(bet);
        bank.deposit(username, -bet.amount);

        accountUpdate(username, socket);
        gameUpdate(io);
        saveState();
    });

    socket.on('fold', msg => {
        const data = JSON.parse(msg);
        const username = data.from;

        if(username == undefined) return;

        let bet = game.placedBets.get(username);

        if(bet)
            bet.folded = true;

        saveState();
    });

    socket.on('loan', msg => {
        const message = JSON.parse(msg);
        const username = message.from;

        if(username == undefined) return;

        const acc = bank.accounts.get(username);

        if(acc){
            if(acc.debt >= bank.defaultIssueAmount || message.data > bank.defaultIssueAmount) {
                rejectLoan(message.data, socket);
                return;
            }

            const amount = message.data;
            bank.loan(username, amount);
            accountUpdate(username, socket);
            bankUpdate(io);

            saveState();
        }
        else{
            console.log("Account " + socket.id + " does not exist!");
        }
    });

    socket.on('pay_debt', msg => {
        const message = JSON.parse(msg);
        const username = message.from;

        if(username == undefined) return;

        bank.payDebt(username, message.data);

        bankUpdate(io);
        accountUpdate(username, socket);

        saveState();
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

    socket.on('end_game_accepted', msg => {
        const message = JSON.parse(msg);
        const username = message.from;

        if(username == undefined) return;
        
        if(game.isContested()){
            socket.emit('game_contested');
            return;
        }

        let gameResult = game.end(message.data);

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
                bank.circulation -= bet.amount;
                continue;
            }

            
            //Shorten debt of all accounts instead if no one won.
            const acc = bank.accounts.get(username);
            if(gameResult.winners.length == 0){
                bank.circulation -= bet.amount;
                acc.debt -= acc.debt > 0 ? bet.amount : 0;

                if(acc.debt == 0) acc.profit -= bet.amount;
            }
            else{
                //Profit is not affected when paying debt.
                acc.setProfit();
            }
            accountUpdate(username, socket);
        }

        //Game bets can now be cleared.
        game.placedBets.clear();

        bankUpdate(io);
        gameUpdate(io); 
        io.emit('game_ended');

        saveState();
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


