class Bet{
    constructor(amount, side, id){
        this.amount = amount;
        this.id = id;
        this.side = side;
        this.folded = false;
        this.hasToCall = false;
    }
}

module.exports = Bet;