function endGame(result, game, bank, db, sockets){
    let gameResult = game.end(result);

    //Deposit winning share to all winners.
    if(gameResult.winners.length > 0){
        gameResult.winners.forEach(item => bank.deposit(item.id, gameResult.poolShare));
    }
    else{
        bank.circulation -= game.pool;
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

        bank.setProfit(username);

        const acc = bank.accounts.get(bet.id);
        acc.sendUpdate(socket);
        acc.saveData(db);
    }

    game.reset();
}

module.exports = {
    endGame
}


