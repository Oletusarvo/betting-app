class Game{
    constructor(gameName = "default"){
        this.pool = 0;
        this.minBet = 0;
        this.gameName = gameName;
        this.placedBets = new Map();
    }

    setName(gameName){
        this.gameName = gameName;
    }
    
    placeBet(bet){
        const existingBet = this.placedBets.get(bet.id);

        if(existingBet){
            existingBet.amount += bet.amount;
        }
        else{
            this.placedBets.set(bet.id, bet);
        }

        this.pool = this.calculatePool();
        this.minBet = bet.amount > this.minBet ? bet.amount : this.minBet;

        return true;
    }

    end(result){
        const winners = Array.from(this.placedBets.values()).filter(item => !item.folded && item.side == result);
        const poolShare = this.pool / winners.length;

        this.pool = 0;
        this.minBet = 0;
        //this.placedBets.clear();
        
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

        return total;
    }
}

module.exports = Game;