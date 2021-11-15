class Game{
    constructor(name){
        this.pool = 0;
        this.minBet = 0;
        this.placedBets = new Map();
        this.name = name;
    }

    setName(name){
        this.name = name;
    }
    
    placeBet(bet){
        const existingBet = this.placedBets.get(bet.id);

        if(existingBet){
            existingBet.amount += bet.amount;
        }
        else{
            this.placedBets.set(bet.id, bet);
        }

        this.pool += bet.amount;
        this.minBet = bet.amount;
    }

    end(result){

        const winners = Array.from(this.placedBets.values()).filter(item => item.side == result);

        const poolShare = this.pool / winners.length;

        this.pool = 0;
        this.minBet = 0;

        return {
            winners : winners,
            poolShare : poolShare
        }

        
    }
}

module.exports = Game;