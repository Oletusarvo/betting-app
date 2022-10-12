const db = require('../models/db');

class Account{
    constructor(data){
        this.data = data;
    }

    async load(username){
        this.data = await db.getAccount(username);
    }

    async update(){
        await db.updateAccount(this.data);
    }

    verifyAmount(amount){
        return amount < 0 ? Math.abs(amount) <= this.data.balance : true;
    }

    async deposit(amount){
        //if(!this.verifyAmount(amount)) throw new Error('Amount exceedes balance!');
        this.data.balance += amount;
        await this.update();
    }
}

class Game{
    constructor(data = null){
        this.bets = [...data.bets];
        delete data.bets;
        this.data = data;
    }

    static async loadGame(id){
        const data = await db.getGame(id);
        const bets = await db.getBets(id);
        data.bets = bets;

        switch(data.type){
            case 'Boolean':
            case 'Multi-Choice':
                return new SelectionGame(data);
           
            case 'Lottery':
                return new LottoGame(data);

            default:
                return new Game(data);
        }
    }

    async load(id){
        this.data = await db.getGame(id);
        this.bets = await db.getBets(id);
        return this.data;
    }

    async getSavedBet(username){
        return await db.getBet(username, this.data.id);
    }

    async update(){
        for(const bet of this.bets){
            const {username, game_id} = bet;
            const savedBet = await db.getBet(username, game_id);
            if(savedBet) 
                await db.updateBet(bet);
            else{
                await db.addBet(bet);
            }    
        }
        await db.updateGame(this.data);
    }

    calculatePool(){
        let total = 0;
        this.bets.forEach(bet => total += bet.amount);
        return total;
    }

    amountIsValid(amount){
        const {minimum_bet, increment} = this.data;
        return amount == minimum_bet || amount == minimum_bet + increment;
    }

    calculateCreatorShare(numWinners){
        const {pool, pool_reserve} = this.data;
        return (pool + pool_reserve) % (numWinners || 1);
    }

    calculateReward(numWinners, creatorShare){
        const {pool, pool_reserve} = this.data;
        return (pool + pool_reserve - creatorShare) / (numWinners || 1);
    }

    isExpired(){
        const today = new Date().getTime();
        const expiry = new Date(this.data.expiry_date).getTime();
        return today >= expiry;
    }

    getBet(username){
       return this.bets && this.bets.find(bet => bet.username === username);
    }

    updateBet(bet){
        const index = this.bets.findIndex(item => item.username === bet.username);
        if(index == -1) return;
        const newBet = this.getBet(bet.username);
        newBet.amount += bet.amount;
        this.bets.splice(index, 1, newBet);
    }

    checkClose(){
        if(!this.isExpired) throw new Error('Cannot close before expiry date!');
    }   

    getMustCall(){
        //Returns the participants who have not bid the minimum bet.
        return this.bets.filter(item => !item.folded && item.amount < this.data.minimum_bet);
    }

    async accountDeposit(username, amount){
        const acc = new Account();
        await acc.load(username);
        acc.deposit(amount);
    }

    async placeBet(bet){
        if(this.isExpired()) throw new Error('Game is expired!');

        const previousBet = this.getBet(bet.username);
        if(previousBet && previousBet.folded) throw new Error('You have folded!');
        if(previousBet && previousBet.amount == this.data.minimum_bet) throw new Error('Cannot raise until minimum bet changes!');
        if(previousBet && previousBet.side !== bet.side) throw new Error('Side switching disallowed!');
        
        const amount = previousBet ? previousBet.amount + bet.amount : bet.amount;

        if(!this.amountIsValid(amount)) throw new Error('Bet amount must be exactly the minimum bet or the minimum bet plus the increment!');

        await this.accountDeposit(bet.username, -bet.amount);

        if(amount > this.data.minimum_bet) this.data.minimum_bet = amount;

        if(previousBet) this.updateBet(bet); else this.bets.push(bet);
        
        this.data.pool = this.calculatePool();

        const mustCall = this.getMustCall();
        for(const participant of mustCall) await this.notify(participant.username, `The minimum bet has been raised. Time to call or fold!`);

        await this.update();
    }

    async close(){
        await db.deleteGame(this.data.id);
    }

    async notify(targetUsername, message){
        const {id, title} = this.data;
        await db.addNote({
            game_id: id,
            game_title: title,
            message,
            username: targetUsername
        });
    }
}

class SelectionGame extends Game{
    constructor(data){
       super(data);
    }

    isContested(){
        const mustCall = super.getMustCall();
        return mustCall.length;
    }

    getWinners(side){
       return this.bets.filter(bet => !bet.folded && bet.side === side).map(item => item.username);
    }

    checkClose(){
        super.checkClose();
        if(this.isContested()) throw new Error('The game is contested!');
    }

    async close(side){
        this.checkClose();
        let winners =  this.getWinners(side);
        const creatorReward = this.calculateCreatorShare(winners.length);
        const reward = this.calculateReward(winners.length, creatorReward);

        winners = winners.map(username => {
            return {
                username, reward
            }
        });

        winners.push({ username: this.data.created_by, reward: creatorReward, });

        for(const winner of winners){
            const {username, reward} = winner;
            if(reward != 0) {
                await this.accountDeposit(username, reward);
                await super.notify(username, `You won ${reward} dice!`);
            }
        }

        await super.close();
    }
}

class LottoGame extends Game{
    constructor(data){
        super(data);
        this.numbers = [];
        for(let n = 1; n < 40; ++n) this.numbers.push(n);
    }

    async close(){
        super.checkClose();
        this.shuffle(20);
        const draw = this.generateRow();
        const results = this.getResults(draw);
        const winners = results.filter(item => item.matches >= this.data.lotto_row_size);
        const creatorShare = super.calculateCreatorShare(winners.length);
        const reward = super.calculateReward(winners.length, creatorShare);

        if(winners.length == 0){
            this.data.pool_reserve += this.data.pool;
            this.data.pool = 0;
            this.bets = [];
            await db.deleteBets(this.data.id);
            this.update();
            return;
        }

        for(const winner of winners) await super.accountDeposit(winner.username, reward);

        await super.close();
    }   

    shuffle(numShuffles){
        for(let i = 0; i < numShuffles; ++i) this.numbers.sort(() => Math.random() >= 0.5 ? 1 : -1);
    }

    getResults(result){
        //Returns the number of matches each participant had on their row.
        const results = [];
        console.log(result);
        this.bets.forEach(bet => {
            const row = bet.side.split(',');
            const matches = this.compareRows(row, result);
            results.push({
                username: bet.username,
                matches,
            });
        });
        return results;
    }

    countWinnersWithMatches(winners, matches){
        let count = 0;
        winners.forEach(winner => count += winner.matches == matches);
        return count;
    }

    generateRow(){
        return this.numbers.slice(0, this.data.lotto_draw_size).sort((a, b) => a - b);
    }

    compareRows(row1, row2){
        let matches = 0;
        for(let i = 0; i < row1.length; ++i){
            for(let j = 0; j < row2.length; ++j){
                matches += row1[i] == row2[j];
            }
        }
        return matches;
    }
}

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

module.exports = {SelectionGame, Game, LottoGame, HexLottoGame, Account};