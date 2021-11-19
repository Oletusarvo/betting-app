const Error = require('./error.js');

class Game{
    constructor(){
        this.pool = 0;
        this.minBet = 0;
        this.name = "name";
        this.placedBets = new Map();
    }

    setName(name){
        this.name = name;
    }
    
    placeBet(bet){
        if(bet.amount < this.minBet) return Error.BetAmount;

        const existingBet = this.placedBets.get(bet.id);

        if(existingBet){
            existingBet.amount += bet.amount;
        }
        else{
            this.placedBets.set(bet.id, bet);
        }

        this.pool = this.calculatePool();
        this.minBet = bet.amount;
    }

    end(result){

        const winners = Array.from(this.placedBets.values()).filter(item => !item.folded && item.side == result);

        const poolShare = this.pool / winners.length;

        this.pool = 0;
        this.minBet = 0;

        return {
            winners : winners,
            poolShare : poolShare
        }

        
    }

    /**@private */
    calculatePool(){
        let total = 0;

        Array.from(this.placedBets.values()).forEach(item => total += item.amount);

        return total;
    }
}

module.exports = Game;