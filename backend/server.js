const express       = require('express');
const http          = require('http');
const path          = require('path');
const socketio      = require('socket.io');
const Bet           = require('./js/bet');
const Bank          = require('./js/bank');
const Game          = require('./js/game');
const db            = require('../models/db');

const utils         = require('./js/utils');
const functions     = require('./js/serverLogic');

const endGame       = functions.endGame;

const usernames = new Map();
const sockets = new Map();


//Required so react works on the front-end.
const react         = require('react');
const reactDom      = require('react-dom');

function saveState(game, bank){
    //db.updateGame(game).then();
    //db.updateBank(bank).then();

   db.update(game, bank).then(console.log('Saved state.')).catch(err => console.log('Unable to update game state!', err));
}

let bank, game = null;
/*
let bankPromise = db.getBank('default');
let gamePromise = db.getGame('default');
let promises = [bankPromise, gamePromise];

Promise.all(promises).then( data => {
    
    bank = new Bank('default');
    game = new Game('default');

    if(data){
        if(data[0]){
            db.getAllAccounts().then(accounts => {
                const bankData = {
                    circulation : data[0].circulation,
                    bank_name : data[0].bank_name,
                    currency_symbol : data[0].currency_symbol,
                    default_issue_amount : data[0].default_issue_amount,
                    accounts : new Map(accounts)
                }

                bank.load(bankData);
            });
           
        }
        
        if(data[1]){
            const gameData = data[1];
            game.load(gameData);
        }
    }
    else{
        //Save the empty data to initialize database.
        db.addBank(bank).then();
        db.addGame(game).then();
    }
    
})
*/

console.log('Starting server...');
let gotData = db.get();
let canLoad = null;

gotData.then(data => {
    if(!data){
        //Database is empty, add initial data in.
        bank = new Bank();
        game = new Game();
        console.log('Saving initial data...');
        canLoad = db.add({game_data: JSON.stringify(game, utils.replacer), bank_data: JSON.stringify(bank, utils.replacer)});
    }
    else{
        bank = JSON.parse(data.bank_data, utils.reviver);
        game = JSON.parse(data.game_data, utils.reviver);
        console.log('Loaded state.');

        canLoad = Promise.resolve();
    }
})
.catch(err => {
    console.log(err);
})
.finally( () => {
    canLoad.then( () => {
        const app           = express();
        const server        = http.createServer(app);
        const io            = socketio(server);
        
        app.use(express.static('frontend'));
        app.use(express.static('node_modules'));
        
        io.on('connection', socket =>{
            console.log("New connection! ID: " + socket.id);
            
            /*
                Sockets can connect and disconnect at any point. Query for 
                the username of a possibly reconnected user.
            */
            socket.emit('query_username');
    
            socket.on('username', msg => {
                //When there is a username stored on the client.
                const message = JSON.parse(msg);
                const username = message.from;
    
                if(username == undefined) return;
    
                const acc = bank.accounts.get(username);
    
                if(!acc) {
    
                }
    
                sockets.set(username, socket);
                usernames.set(socket.id, username);
    
                acc.sendUpdate(socket);
                game.sendUpdate(socket);
                bank.sendUpdate(socket);
    
                //Also send a bet accepted to set relevant variables on the client side.
                const bet = game.placedBets.get(username);
                if(bet){
                    socket.emit('bet_accepted', bet.amount);
                }
    
                console.log(`${username} reconnected!`);
            });
    
            //Send current game state to new connection.
            socket.on('fetch_data', msg => {
                const message = JSON.parse(msg);
                const username = message.from;
    
                if(username == undefined){
                    return;
                }
    
                if(username == ''){
                    socket.emit('login_rejected', 'Username is empty!');
                    return;
                }
    
                const password = message.data;
                if(password == ''){
                    socket.emit('login_rejected', 'Password is empty!');
                    return;
                }
        
                db.getAccount(username).then(data => {
                    if(!data){
                        socket.emit('login_rejected', `Account \'${username}\' does not exist!`);
                    }
                    else{
                        if(data.password != password){
                            socket.emit('login_rejected', 'Incorrect password!');
                            return;
                        }
    
                        usernames.set(socket.id, username);
                        sockets.set(username, socket);
                        
                        socket.emit('login_success', username);
                        
                        //Also send a bet accepted to set relevant variables on the client side.
                        const bet = game.placedBets.get(username);
                        if(bet){
                            socket.emit('bet_accepted', bet.amount);
                        }
    
                        bank.accounts.get(username).sendUpdate(socket);
                        bank.sendUpdate(socket);
                        game.sendUpdate(socket);
                        
                        saveState(game, bank);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            });
    
            socket.on('create_account', msg => {
                const message = JSON.parse(msg);
                const username = message.data.username;
                const password = message.data.password;
    
                if(username == ''){
                    socket.emit('account_rejected', 'Username is empty!');
                    return;
                }
    
                if(password == ''){
                    socket.emit('account_rejected', 'Password is empty!');
                    return;
                }
    
                db.getAccount(username).then(data => {
                    if(data){
                        socket.emit('account_rejected', `An account with username ${username} already exists!`);
                        return;
                    }
                    else{
                        sockets.set(username, socket);
                        usernames.set(socket.id, username);
    
                        bank.addAccount(username, password);
                        socket.emit('login_success', username);
    
                        bank.accounts.get(username).sendUpdate(socket);
                        bank.sendUpdate(socket);
                        game.sendUpdate(socket);
    
                        
                        bank.accounts.get(username).saveData(db);
                        saveState(game, bank);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
                
            });
        
            socket.on('disconnect', () => {
                //Delete account associated with this socket. Leave game pool intact.
                const username = usernames.get(socket.id);
                usernames.delete(socket.id);
                sockets.delete(username);
            });
        
            socket.on('place_bet', msg => {
                const message = JSON.parse(msg);
                const username = message.from;
        
                if(username == undefined) return;
    
                if(game.hasFolded(username)){
                    socket.emit('bet_rejected', 'You cannot bet as you have folded!');
                    return;
                }
                
                const amount = message.data.amount;
    
                if(amount < game.minBet){
                    socket.emit('bet_rejected', `Bet must be higher or equal to ${game.minBet} `);
                    return;
                }
    
                if(!bank.hasFunds(message.from, amount)){
                    socket.emit('bet_rejected', `Amount exceedes your account balance!`);
                    return;
                }
    
                const newBet = new Bet(message.data.amount, message.data.side, message.from);
                game.placeBet(newBet);
                bank.deposit(username, -newBet.amount);
    
                bank.accounts.get(username).sendUpdate(socket);
                game.sendUpdate(io);
    
                bank.accounts.get(username).saveData(db);
                //game.saveData(db);
    
                socket.emit('bet_accepted', newBet.amount);
    
                //Other participants have to raise.
                if(game.isRaised){
                    socket.broadcast.emit('game_raised', game.placedBets.get(username).amount);
                }
                
                saveState(game, bank);
            });
        
            socket.on('call_bet', msg => {
                const message = JSON.parse(msg);
                const bet = game.placedBets.get(message.from);
                if(bet){
                    if(bet.folded){
                        socket.emit('call_rejected', 'You cannot call, as you have folded!');
                        return;
                    }
    
                    const amountToCall = game.minBet - bet.amount;
    
                    if(!bank.hasFunds(message.from, amountToCall)){
                        socket.emit('call_rejected', 'Amount exceedes account balance!');
                        return;
                    }
    
                    bank.deposit(message.from, -amountToCall);
                    game.raiseBet(message.from, amountToCall);
                }
                else{
                    const amount = message.data.amount;
                    const side = message.data.side;
                    const newBet = new Bet(amount, side, message.from);
    
                    if(!bank.hasFunds(message.from, amount)){
                        socket.emit('call_rejected', 'Amount exceedes account balance!');
                        return;
                    }
    
                    game.placeBet(newBet);
                    bank.deposit(message.from, -newBet.amount);
                }
    
                bank.accounts.get(message.from).sendUpdate(socket);
                game.sendUpdate(io);
    
                bank.accounts.get(message.from).saveData(db);
                //game.saveData(db);
    
                if(game.isRaised){
                    socket.broadcast.emit('game_raised', game.placedBets.get(message.from).amount);
                }
    
                socket.emit('call_accepted');
                saveState(game, bank);
            });
        
            socket.on('fold', msg => {
                const data = JSON.parse(msg);
                const username = data.from;
        
                if(username == undefined) return;
        
                let bet = game.placedBets.get(username);
        
                if(bet){
                    if(bet.folded){
                        socket.emit('fold_rejected', 'You have already folded!');
                        return;
                    }
    
                    bet.folded = true;
                }   
                else{
                    socket.emit('fold_rejected', 'There is no bet to fold!');
                    return;
                }
                
                socket.emit('fold_accepted');
                saveState(game, bank);
            });
        
            socket.on('loan', msg => {
                const message = JSON.parse(msg);
                const username = message.from;
        
                if(username == undefined) return;
                
                const acc = bank.accounts.get(username);
        
                if(acc){
                    if(acc.debt >= bank.defaultIssueAmount){
                        socket.emit('loan_rejected', 'Your debt is maxed out!');
                        return;
                    }
    
                    if(message.data > bank.defaultIssueAmount){
                        socket.emit('loan_rejected', 'Amount exceedes maximum allowed loan!');
                        return;
                    }
        
                    const amount = message.data;
                    bank.loan(username, amount);
    
                    bank.accounts.get(username).sendUpdate(socket);
                    bank.sendUpdate(io);
    
                    bank.accounts.get(username).saveData(db);
                    bank.saveData(db);
        
                    saveState(game, bank);
                }
                else{
                    console.log("Account " + socket.id + " does not exist!");
                }
            });
        
            socket.on('pay_debt', msg => {
                const message = JSON.parse(msg);
                const username = message.from;
        
                if(username == undefined) return;
                
                const acc = bank.accounts.get(username);
    
                if(message.data > acc.balance){
                    socket.emit('general_error', `Amount exceedes account balance!`);
                    return;
                }
    
                if(message.data > acc.debt){
                    socket.emit('general_error', 'Amount exceedes debt!');
                    return;
                }
    
                bank.payDebt(username, message.data);
        
                bank.sendUpdate(io);
                bank.accounts.get(username).sendUpdate(socket);
    
                bank.accounts.get(username).saveData(db);
                bank.saveData(db);
    
                saveState(game, bank);
            });
        
            socket.on('end_game', msg =>{
                //When someone presses the end game button, all participants have to vote for the game to end.
                const message = JSON.parse(msg);
                const result = message.data;
                if(typeof result !== 'boolean'){
                    console.log(`Cannot end game. Result is not a boolean! (${result})`);
                    socket.emit('end_game_rejected', 'Server error.');
                    return;
                }
    
                //Only send this to the ones participating in the game.
                const placedBets = game.placedBets;
                for(let bet of placedBets.values()){
                    const socket = sockets.get(bet.id);
                    if(!socket) continue;
                    socket.emit('end_game_request', result);
                }
            });
        
            socket.on('end_game_vote', msg =>{
                if(game.isContested()){
                    socket.emit('game_contested');
                    return;
                }
    
                const message = JSON.parse(msg);
                const vote = message.data.vote;
    
                if(typeof vote !== 'boolean'){
                    console.log('Received invalid vote!');
                    socket.emit('vote_rejected', 'Your vote is not a boolean!');
                    return;
                }
    
                game.placeVote(vote);
                const allHaveVoted = game.allHaveVoted();
    
                if(allHaveVoted){
                    const canEnd = game.canEnd();
                    if(canEnd){
                        const result = message.data.result;
                        endGame(result, game, bank, sockets);
    
                        bank.sendUpdate(io);
                        game.sendUpdate(io);
    
                        bank.saveData(db);
                        //game.saveData(db);
    
                        io.emit('game_ended');
            
                        saveState(game, bank);
                    }
                    else{
                        io.emit('end_game_rejected', 'Did not receive enough yes votes to end the game. Game continues.');
                    }
    
                    game.clearVotes();
                }
            });
    
            socket.on('end_game_bypass', msg => {
                //Use this to bypass voting.
                if(game.isContested()){
                    socket.emit('game_contested');
                    return;
                }
                const message = JSON.parse(msg);
                const result = message.data;
    
                if(typeof result !== 'boolean'){
                    socket.emit('end_game_rejected', 'result is not a boolean!');
                    return;
                }
    
                endGame(result, game, bank, db, sockets);
    
                game.sendUpdate(io);
                bank.sendUpdate(io);
    
                bank.saveData(db);
                //game.saveData(db);
    
                io.emit('game_ended');
    
                saveState(game, bank);
            });
    
            socket.on('set_game_name', msg => {
                const message = JSON.parse(msg);
                game.gameName = message.data;
    
                game.sendUpdate(io);
                //game.saveData(db);
            });
        })
    
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.log(err);
    });
});







