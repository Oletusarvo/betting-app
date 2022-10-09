const db = require('../dbConfig.js');
const crypto = require('crypto');

class Bank{
    //Used to handle user accounts.
    constructor(options = null){
        this.options = options;
    }

    async addAccount(username, password){      
        await db('accounts').insert({
            username,
            password,
            balance: 10000,
        });
    }

    async getAccount(username){
        return await db('accounts').where({username}).first();
    }

    async deleteAccount(username){
        return await db('accounts').where({username}).del();
    }

    async deposit(username, amount){
        const acc = await db('accounts').where({username}).first();

        acc.balance += amount;
        return await db('accounts').where({username}).update(acc);
    }
}

const bank = new Bank();

class Game{
    constructor(){
        this.error = {
            INCREMENT : 1,
            BALANCE : 2,
            CALL : 3,
            MINBET : 4,
        }
    }
    /**@private */
    async calculatePool(){
        const bets = await this.getAllBets();
        let total = 0;
        
        for(let bet of bets){
            total += bet.amount;
        }

       return total;
    }

    calculateCreatorShare(numWinners){
        return (this.game.pool + this.game.pool_reserve) % numWinners || 0;
    }

    /**@private */
    async update(){
        await db('games').where({id : this.game.id}).update(this.game);
        await this.load(this.game.id);
    }

    async load(id){
        this.game = await db('games').where({id}).first();
        return this;
    }

    async placeBet(bet){
        await this.validateBet(bet);

        const {username, amount} = bet;
        const previousBet = await this.getBet(username);
        const newAmount = previousBet ? previousBet.amount + amount : amount;

        if(newAmount > this.game.minimum_bet){
            this.game.minimum_bet = newAmount;
        }

        if(previousBet){
            bet.amount = newAmount
            await this.updateBet(bet);
        }
        else{
            await db('bets').insert(bet);
        }

        await bank.deposit(username, -amount);

        this.game.pool = await this.calculatePool();

        await this.update();
    }

    async updateBet(bet){
        return await db('bets').where({username: bet.username, game_id: this.game.id}).update(bet);
    }

    async fold(username){
        const previousBet = await db('bets').where({game_id : this.game.id, username}).first();
        if(previousBet){
            if(previousBet.folded){
                throw new Error('You have already folded!');
            }

            await db('bets').where({game_id : this.game.id, username}).update({
                folded : true
            });
        }
        else{
            throw new Error('No bet to fold!');
        }

        return await db('bets').where({username, game_id : this.game.id}).first();
    }

    async getBet(username){
        return await db('bets').where({game_id : this.game.id, username}).first();
    }

    async getAllBets(){
        return await db('bets').where({game_id : this.game.id});
    }

    async close(side){
        //await this.isContested();

        const participants = await this.getAllBets();
        if(this.game.type === 'Lottery' && participants.length == 0){
            throw new Error('Cannot draw a lottery containing no bets!');
        }

        const now = new Date().getTime();
        const expiry = new Date(this.game.expiry_date).getTime();

        if(now < expiry){
            throw new Error('Cannot close the game before its expiry date!');
        }
        
        const {pool, pool_reserve} = this.game;

        await this.autoFold(participants);

        const results = this.getResults(participants, side);
        const winners = this.game.type === 'Lottery' ? results.filter(item => item.matches === this.game.lotto_row_size) : results;
        const shareForCreator = this.calculateCreatorShare(winners.length); 

        const combinedPool = pool + pool_reserve;
        const share = Math.round((combinedPool - shareForCreator) / winners.length);

        //Lottery games will not be cleared if there were no winners.
        if(this.game.type === 'Lottery' && winners.length === 0){
            this.game.pool_reserve += await this.calculatePool();
            this.game.pool = 0;
            await db('bets').where({game_id: this.game.id}).del();
            await this.update();
            return;
        }

        await bank.deposit(this.game.created_by, shareForCreator); //The creator of the bet gets the remainder of what would have been an uneven division.

        for(let winner of winners){
            await bank.deposit(winner.username, share);
            
            await db('notifications').insert({
                username : winner.username,
                message : `Won ${share} dice!`,
                title : this.game.title,
                id : this.game.id,
            });
        }

        await this.clear();
    }

    async addNotification(participants, msg){
        for(const participant of participants){
           
            await db('notifications').insert({
                title: this.game.title,
                id: this.game.id,
                message: msg,
                username: participant.username,
            });
        }
    }

    getResults(participants, side){
        if(this.game.type !== 'Lottery'){
            return participants.filter(item => item.side == side && item.folded != true);
        }
        else{
            const lottoResult = this.generateRow(20);
            const results = [];

            //console.log(`Lottery result: ${lottoResult}`);
            for(const item of participants) {
                const itemRow = item.side.split(',');
                const matches = this.compareRow(itemRow, lottoResult);

                console.log(`${item.username}: ${matches} matches.`);
                results.push({
                    username: item.username,
                    matches,
                    row: itemRow,
                });
            }

            return results;
        }
    }

    generateRow(numShuffles){
        const numbers = [];
        for(let n = 1; n <= 40; ++n){
            numbers.push(n);
        }

        for(let i = 0; i < numShuffles; ++i){
            numbers.sort(() => Math.random() < 0.5 ? -1 : 1);
        }

        return numbers.slice(0, this.game.draw_size).sort((a, b) => a - b);
    }

    async clear(){
        await db('bets').where({game_id : this.game.id}).del();
        await db('games').where({id : this.game.id}).del();
    }

    data(){
        const {title, id, pool, minimum_bet, created_by, expiry_date, increment, options, type, lotto_row_size, pool_reserve} = this.game;

        return {
            title,
            id,
            pool: (pool + pool_reserve),
            minimum_bet,
            created_by,
            expiry_date,
            increment,
            options,
            type,
            lotto_row_size,
        }
    }
    async isContested(){
        const bets = await this.getAllBets();
        for(const bet of bets){
            if(bet.amount !== this.game.minimum_bet && bet.folded != 1){
                throw new Error('Game is contested!');
            }
        }
    }

    autoFold(participants){
        //Folds all bets not meeting the minimum bet.
        if(this.game.type === 'Lottery') return;

        for(const bet of participants){
            if(bet.amount != this.game.minimum_bet){
                bet.folded = true;
            }
        }

        return participants;
    }

    compareRow(row1, row2){
        let matches = 0;
        for(let i = 0; i < row1.length; ++i){
            for(let j = 0; j < row2.length; ++j){
                if(row1[i] == row2[j]){
                    matches++;
                }
            }
        }

        return matches;
    }

    async validateBet(bet){
        const {username, side, amount} = bet;

        const previousBet = await this.getBet(username);
        const account = await bank.getAccount(username);

        if(new Date().getTime() >= new Date(this.game.expiry_date).getTime()){
            throw new Error('The bet has expired!');
        }

        if(amount > account.balance){
            throw new Error('Amount exceedes your balance!');
        }

        if(amount - this.game.minimum_bet > this.game.increment){
            throw new Error('Your bet cannot exceed the minimum bet by more than the defined increment!');
        }

        if(previousBet){
            const previousAmount = previousBet.amount;
            const previousSide = previousBet.side;
            const combinedAmount = previousAmount + amount;

            if(previousBet.folded){
                throw new Error('You have folded!');
            }

            if(previousSide !== side){
                throw new Error('Side switching disallowed!');
            }
            
            if(previousAmount >= this.game.minimum_bet){
                throw new Error('Cannot raise until minimum bet has changed!');
            }
            
            if(combinedAmount < this.game.minimum_bet){
                throw new Error('Amount must be at least the minimum bet amount!');
            }

            
        }
        else{
            if(amount < this.game.minimum_bet){
                throw new Error('Amount must be at least the minimum bet amount!');
            }
        }
    }
}

const game = new Game();

class Database{
    async insertGame(game){
        const {title, id, minimum_bet, increment, expiry_date, created_by, available_to, options, type, lotto_row_size} = game;

        if(expiry_date != ''){
            const today = new Date();
            const expiryDay = new Date(expiry_date);

            if(today.getDay() == expiryDay.getDay()){
                throw new Error('Bet expiry must be at least tomorrow!');
            }
        }
        
        return await db('games').insert({
            id : id || crypto.createHash('SHA256').update(title + minimum_bet + increment + expiry_date + available_to + new Date().toDateString()).digest('hex'),
            title,
            minimum_bet,
            increment,
            expiry_date : expiry_date == '' ? 'When Closed' : expiry_date,
            created_by,
            available_to,
            type,
            options : type === 'Boolean' ? 'Kyllä;Ei' : options,
            lotto_row_size
        });
    }

    async deleteGame(id){
        return await db('games').where({id}).del();
    }

    async insertNotification(notification){
        const {username, message} = notification;
        return await db('notifications').insert({
            username,
            message,
            id,
            title,
            notification_id : crypto.createHash('SHA256').update(username + message + new Date().getTime()).digest('hex'),
        });
    }

    async deleteNotifications(username){
        return await db('notifications').where({username}).del();
    }

    async getNotifications(username = undefined){
        if(username === undefined){
            return await db('notifications');
        }

        return await db('notifications').where({username});
    }

    async getGame(id){
        return await db('games').where({id}).first();
    }

    async updateGame(game){
        return await db('games').where({id : game.id}).update(game);
    }

    async getGamesByUser(username){
        return await db('games').where({created_by : username});
    }

    async getAllGames(){
        return await db('games');
    }

    async getBank(){
        return new Bank();
    }
}

const database = new Database();

module.exports = {bank, database, game}