class Game{
    constructor(gameName = "default"){
        this.pool = 0;
        this.minBet = 0.01;
        this.gameName = gameName;
        this.placedBets = new Map();
        this.votes      = [];
        this.isRaised   = false;
    }

    load(data){
        this.pool = data.pool;
        this.minBet = data.min_bet;
        this.gameName = data.game_name;
        this.votes  = JSON.parse(data.votes);
        this.isRaised = data.isRaised;
    }

    setName(gameName){
        this.gameName = gameName;
    }
    
    placeBet(bet){
        const existingBet = this.placedBets.get(bet.id);

        let amount = 0;

        if(existingBet){
            existingBet.amount += bet.amount;
            amount = existingBet.amount;
        }
        else{
            this.placedBets.set(bet.id, bet);
            amount = bet.amount;
        }

        this.calculatePool();
        this.calculateRaised(amount);
        this.calculateMinBet();
    }

    hasFolded(username){
        const bet = this.placedBets.get(username);
        return bet && bet.folded;
    }

    raiseBet(username, amount){
        const bet = this.placedBets.get(username);
        bet.amount += amount;

        this.calculateMinBet();
        this.calculateRaised(bet.amount);
        this.calculatePool();
    }

    placeVote(vote){
        this.votes.push(vote);
    }

    canEnd(){
        let canEnd = false;
        //All participants have cast their vote.
        //If the majority (over 50%) voted to end the game, it will end.
        const threshold = 0.5;
        let numYes = 0;
        let numNo = 0;
        const numParticipants = this.placedBets.size;
        
        for(let vote of this.votes){
            if(vote){
                numYes++;
            }
            else{
                numNo++;
            }
        }

        if(numYes / numParticipants > threshold){
            canEnd = true;
        }
        return canEnd;
    }

    sendUpdate(socket){
        socket.emit('game_update', JSON.stringify({
            pool : this.pool, 
            minBet : this.minBet,
            gameName : this.gameName
        }));
    }

    saveData(db){
        db.getGame(this.gameName).then(data => {
            if(data){
                db.updateGame(this).then(data => {
                    console.log(`Game \'${this.gameName}\' updated data.`);
                })
                .catch(err => {
                    console.log(`Failed to update game \'${this.gameName}\'!`, err);
                });
            }
            else{
                db.addGame(this).then(data => {
                    console.log(`Game \'${this.gameName}\' saved data.`);
                })
                .catch(err => {
                    console.log(`Failed to save game \'${this.gameName}\'!`, err);
                });
            }
        })
        .catch(err => {
            console.log(`Unable to get data for game \'${this.gameName}\'!`, err);
        });
    }

    allHaveVoted(){
        return this.votes.length == this.placedBets.size;
    }

    clearVotes(){
        this.votes = [];
    }

    end(result){
        const winners = Array.from(this.placedBets.values()).filter(item => !item.folded && item.side == result);
        const poolShare = this.pool / winners.length;
        
        return {
            winners : winners,
            poolShare : poolShare
        }
    }

    isContested(){
        for(let item of this.placedBets.values()){
            if(item.amount < this.minBet && !item.folded){
                return true;
            }
        }

        return false;
    }

    /**@private */
    calculatePool(){
        let total = 0;

        Array.from(this.placedBets.values()).forEach(item => total += item.amount);

        this.pool = total;
    }

    /**@private */
    calculateMinBet(){
        let max = 0;
        Array.from(this.placedBets.values()).forEach( item => {
            if(item.amount > max){
                max = item.amount;
            }
        });

        this.minBet = max;
    }

    /**@private */
    calculateRaised(amount){
        this.isRaised = (this.placedBets.size > 1) && (amount > this.minBet);
    }

    /**@private */
    reset(){
        this.pool = 0;
        this.minBet = 0.01;
        this.placedBets.clear();
    }
}

module.exports = Game;