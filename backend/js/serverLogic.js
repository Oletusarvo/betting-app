function bankUpdate(bank, socket){
    //db.updateBank(bank.bank_name).then();
    socket.emit('bank_update', JSON.stringify({
        circulation : bank.circulation,
        currencySymbol : bank.currencySymbol
    }));
}

function gameUpdate(game, socket){
    //db.updateGame(game.game_name).then();

    socket.emit('game_update', JSON.stringify({
        pool : game.pool, 
        minBet : game.minBet,
        name : game.name
    }));
}

function accountUpdate(username, bank, socket){
    const acc = bank.accounts.get(username);
    if(!acc){
        console.log(`Account update aborted. Username ${username} does not exist!`);
        return;
    }
    //db.updateAccount(username).then();

    socket.emit('account_update', JSON.stringify({
        balance : acc.balance,
        debt : acc.debt,
        profit : acc.profit
    }));
}

function endGame(result, game, bank, sockets){
    let gameResult = game.end(result);

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
        const socket = sockets.get(username); //What if a socket disconnects and reconnects? This will be undefined.

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
        accountUpdate(username, bank, socket);
    }

    //Game bets can now be cleared.
    game.placedBets.clear();
}

module.exports = {
    endGame,
    accountUpdate,
    gameUpdate,
    bankUpdate
}


