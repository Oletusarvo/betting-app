class HexLottoGame extends Game{
    constructor(data){
        super(data);
    }

    generateNumber(){
        return Math.floor(Math.random() * this.mask);
    }

    calculateHash(bet){
        return BigInt(`0x${crypto.createHash('SHA256').update(JSON.stringify(bet)).digest('hex')}`);
    }

    getWinners(){
        const winners = [];
        this.bets.forEach(bet => {
            const betHash = this.calculateHash(bet) & BigInt(this.data.mask);
            const n = this.generateNumber() ^ betHash ^ (new Date().getTime() & this.data.mask);

            if(n <= this.data.threshold) winners.push({
                username: bet.username,
                betHash
            });
        });
        return winners;
    }
}

module.exports = HexLottoGame;