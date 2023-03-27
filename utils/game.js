const db = require('../dbConfig');
const currency = require('../currencyfile');
const Account = require('./account');

class Game{
    constructor(data = null){
        this.bets = [...data.bets];
        delete data.bets;
        this.data = data;
        this.notes = [];
    }

    static async loadGame(id){
        const data = await db('games').where({id}).first();
        const bets = await db('bets').where({game_id: id});
        data.bets = bets;

        switch(data.type){
            case 'Boolean':
            case 'Multi-Choice':
                return new (require('./selectiongame'))(data);
           
            case 'Lottery':
                return new (require('./lottogame'))(data);

            default:
                return new Game(data);
        }
    }

    getNotes(){
        const data = [...this.notes];
        this.notes = [];
        return data;
    }
    
    async load(id){
        this.data = await db('games').where({id}).first();
        this.bets = await db('bets').where({game_id: id});
        return this.data;
    }

    async getSavedBet(username){
        return await db('bets').where({username, game_id: this.data.id}).first();
    }

    async update(){
        //Updates database entries.
        for(const bet of this.bets){
            const {username} = bet;
            const savedBet = await this.getSavedBet(username);
            if(savedBet) 
                await db('bets').where({username, game_id: this.data.id}).update(bet);
            else{
                await db('bets').insert(bet);
            }    
        }
        await db('games').where({id: this.data.id}).update(this.data);
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
        numWinners = numWinners || 1;

        const multiplier = Math.pow(10, currency.precision);
        const totalPool = pool + pool_reserve;
        const winnerShare = Math.floor(totalPool / numWinners * multiplier) / multiplier;

        return totalPool - (winnerShare * numWinners);
    }

    calculateReward(numWinners, creatorShare){
        const {pool, pool_reserve} = this.data;
        numWinners = numWinners || 1;
        const totalPool = pool + pool_reserve;
        return (totalPool - creatorShare) / numWinners;
    }

    isExpired(){
        const today = new Date().getTime();
        const expiry = new Date(this.data.expiry_date).getTime();
        return today >= expiry;
    }

    getBet(username){
       return this.bets && this.bets.find(bet => bet.username === username);
    }

    updateBet(previousBet, bet){
        if(!previousBet) return;
        previousBet.amount += bet.amount;
    }

    checkClose(){
        if(!this.isExpired) throw new Error('Ei voida sulkea ennen eräpäivää!');
    }   

    autoFold(){
        //Called upon ending a contested game, to automatically fold participants who haven't called a raised bet.
        this.bets.forEach(bet => {
            if(!bet.folded && bet.amount < this.data.minimum_bet){
                bet.folded = true;
            }
        });
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

    isClosed(){
        return this.data.closed;
    }
    
    async placeBet(bet){
        if(this.isClosed()) throw new Error('Peli on toistaiseksi suljettu!');
        if(this.isExpired()) throw new Error('Peli on erääntynyt!');

        const previousBet = this.getBet(bet.username);
        if(previousBet && previousBet.folded) throw new Error('Olet luovuttanut!');
        if(previousBet && previousBet.amount == this.data.minimum_bet) throw new Error('Et voi korottaa ennenkuin vähimmäispanos muuttuu!');
        if(previousBet && previousBet.side !== bet.side) throw new Error('Position vaihto kielletty!');
        
        const amount = previousBet ? previousBet.amount + bet.amount : bet.amount;

        if(!this.amountIsValid(amount)) throw new Error('Vedon määrän tulee olla yhtä suuri kuin vähimmäispanos, tai vähimmäispanos plus korotus.');

        await this.accountDeposit(bet.username, -bet.amount);

        if(amount > this.data.minimum_bet) this.data.minimum_bet = amount;

        if(previousBet) this.updateBet(previousBet, bet); else this.bets.push(bet);
        
        this.data.pool = this.calculatePool();

        const mustCall = this.getMustCall();
        for(const participant of mustCall) await this.notify(participant.username, `Vähimmäispanos on noussut. Aika vastata tai luovuttaa!`);

        await this.update();
    }

    async close(){
        await db('games').where({id: this.data.id}).del();
    }

    async notify(targetUsername, message){
        const {id, title} = this.data;

        const note = {
            game_title : title,
            message,
            username: targetUsername
        };

        this.notes.push(note);
    }

    sendNotes(socket){
        socket.emit('notes_update', this.notes);
        this.notes = [];
    }

    async fold(username){
        const bet = this.bets.find(b => b.username === username);
        bet.folded = true;
        await this.update();
        return bet;
    }
}

module.exports = Game;