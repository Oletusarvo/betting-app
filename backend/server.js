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

const clients = new Map();
const sockets = new Map();


//Required so react works on the front-end.
const react         = require('react');
const reactDom      = require('react-dom');

function saveState(){
   db.update(game, bank).then(console.log('Saved state.'));
}

function bankUpdate(socket){
    //db.updateBank(bank.bank_name).then();
    socket.emit('bank_update', JSON.stringify({
        circulation : bank.circulation,
        currencySymbol : bank.currencySymbol
    }));
}

function hasToCallUpdate(socket){
    socket.emit('has_to_call', amount);
}

function gameUpdate(socket){
    //db.updateGame(game.game_name).then();

    socket.emit('game_update', JSON.stringify({
        pool : game.pool, 
        minBet : game.minBet,
        name : game.name
    }));
}

function accountUpdate(username, socket){
    const acc = bank.accounts.get(username);
    //db.updateAccount(username).then();

    socket.emit('account_update', JSON.stringify({
        balance : acc.balance,
        debt : acc.debt,
        profit : acc.profit
    }));
}

function rejectLoan(amount, socket){
    socket.emit('loan_rejected', amount);
}

let bank = null;
let game = null;

db.get().then(data => {
    if(!data){
        //Database is empty, add initial data in.
        db.add({game_data: JSON.stringify(game, replacer), bank_data: JSON.stringify(bank, replacer)}).then();
        bank = new Bank();
        game = new Game();
    }
    else{
        bank = JSON.parse(data.bank_data, reviver);
        game = JSON.parse(data.game_data, reviver);
        console.log('Loaded state.');
    }
})
.finally( () => {
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
                db.addAccount(bank.accounts.get(username));
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
            const acc = bank.accounts.get(message.from);
            acc.isLoggedIn = false;
            
            console.log('logging out...');
            socket.emit('logout_success');
            socket.disconnect(true);
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
    
            const bet = game.placedBets.get(username);
    
            if(bet && bet.folded == true){
                socket.emit('bet_rejected', 'You cannot bet as you have folded!');
                return;
            }

            const newBet = new Bet(message.data.amount, message.data.side, message.from);
            game.placeBet(newBet);
            bank.deposit(username, -newBet.amount);
            accountUpdate(username, socket);
            gameUpdate(io);
            saveState();
        });
    
        socket.on('call', msg => {
            const message = JSON.parse(msg);
    
            const bet = game.placedBets.get(message.from);
    
            if(!bet){
                socket.emit('call_rejected', 'There is no bet to raise!');
                return;
            }
            else{
    
                if(bet.folded){
                    socket.emit('call_rejected', 'You cannot call, as you have folded!');
                }
                //The bet can only ever be equal to or smaller than the minimum bet, because of how the game works.
                else if(bet.amount == game.minBet){
                    socket.emit('call_rejected', 'Your bet is already equal to the minimum bet!');
                }
                else{
                    const account = bank.accounts.get(message.from);
    
                    if(!account){
                        console.log(`Cannot call. Account with username ${message.from} does not exist!`);
                    }
                    else{
                        //It is assumed the minimum bet is bigger than the previous bet amount if calling in the first place.
                        const amountToRaise = game.minBet - bet.amount;
    
                        if(amountToRaise > account.balance){
                            socket.emit('call_rejected', 'Amount exceedes account balance!');
                        }
                        else{
                            console.log('röböls');
                            bank.deposit(message.from, -amountToRaise);
                            game.placeBet(new Bet(amountToRaise, bet.side, message.from));
    
                            accountUpdate(message.from, socket);
                            gameUpdate(io);  
                        }
                    }
                }
            }
        })
    
        socket.on('fold', msg => {
            const data = JSON.parse(msg);
            const username = data.from;
    
            if(username == undefined) return;
    
            let bet = game.placedBets.get(username);
    
            if(bet)
                bet.folded = true;
            else{
                socket.emit('fold_rejected', 'There is no bet to fold!');
            }
    
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
            if(gameResult.winners.length > 0){
                for(let winner of gameResult.winners){
                    bank.deposit(winner.id, gameResult.poolShare);
                }
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
                }

                acc.setProfit();
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
});






