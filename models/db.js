const db = require('../dbConfig.js');
const crypto = require('crypto');

class Bank{
    //Used to handle user accounts.
    constructor(options = null){
        this.options = options;
    }

    async addAccount(username, password){
        const acc = await db('accounts').where({username}).first();
        if(acc){
           throw new Error(`Account with username ${username} already exists!`);
        }
        else{
            await db('accounts').insert({
                username,
                password,
                balance: 100
            });
        }
    }

    async getAccount(username){
        return await db('accounts').where({username}).first();
    }

    async deleteAccount(username){
        return await db('accounts').where({username}).del();
    }

    async deposit(username, amount){
        const acc = await db('accounts').where({username}).first();
        if(!acc) return false;

        acc.balance += amount;
        await db('accounts').where({username}).update(acc);
        return true;
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

    /**@private */
    async update(){
        await db('games').where({game_id : this.game.game_id}).update(this.game);
        await this.load(this.game.game_id);
    }

    async load(game_id){
        this.game = await db('games').where({game_id}).first();
        return this;
    }

    async placeBet(bet){
        await this.validateBet(bet);
        const {username, amount} = bet;
        const previousBet = await this.getBet(username);
        const newAmount = previousBet ? previousBet.amount + amount : amount;

        if(newAmount > this.game.minimum_bet){

            this.game.minimum_bet = newAmount;
            const callers = (await this.getAllBets()).filter(item => item.username != username);
            for(const caller of callers){
                await db('notifications').insert({
                    username : caller.username,
                    message : 'Time to call!',
                    game_id : this.game.game_id,
                    game_title : this.game.game_title,
                });
            }
        }

        if(previousBet){
            bet.amount = newAmount;
            await db('bets').where({username, game_id : this.game.game_id}).update(bet);
        }
        else{
            await db('bets').insert(bet);
        }

        const bank = new Bank();
        await bank.deposit(username, -amount);

        this.game.pool = await this.calculatePool();

        await this.update();
    }

    async fold(username){
        const previousBet = await db('bets').where({game_id : this.game.game_id, username}).first();
        if(previousBet){
            if(previousBet.folded){
                throw new Error('You have already folded!');
            }

            await db('bets').where({game_id : this.game.game_id, username}).update({
                folded : true
            });
        }
        else{
            throw new Error('No bet to fold!');
        }

        return await db('bets').where({username, game_id : this.game.game_id}).first();
    }

    async getBet(username){
        return await db('bets').where({game_id : this.game.game_id, username}).first();
    }

    async getAllBets(){
        return await db('bets').where({game_id : this.game.game_id});
    }

    async close(side){
        await this.isContested();
        const now = new Date().getTime();
        const expiry = new Date(this.game.expiry_date).getTime();

        if(now < expiry){
            throw new Error('Cannot close the game before its expiry date!');
        }
        
        const {pool} = this.game;
        const participants = await this.getAllBets();
        const winners = participants.filter(item => item.side == side && item.folded != true);
        const shareForCreator = pool % winners.length || 0;
        const share = Math.round((pool - shareForCreator) / winners.length);

        await bank.deposit(this.game.created_by, shareForCreator); //The creator of the bet gets the remainder of what would have been an uneven division.

        for(let winner of winners){
            await bank.deposit(winner.username, share);
            /*
            await db('notifications').insert({
                username : winner.username,
                message : `Won ${share} dice!`,
                game_title : this.game.game_title,
                game_id : this.game.game_id,
            })
            */
        }

        
        await this.clear();
    }

    async clear(){
        await db('bets').where({game_id : this.game.game_id}).del();
        await db('games').where({game_id : this.game.game_id}).del();
    }

    data(){
        const {game_title, game_id, pool, minimum_bet, created_by, expiry_date, increment, options} = this.game;
        return {
            game_title,
            game_id,
            pool,
            minimum_bet,
            created_by,
            expiry_date,
            increment,
            options
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
        const {game_title, game_id, minimum_bet, increment, expiry_date, created_by, available_to, options, type} = game;

        if(expiry_date != ''){
            const today = new Date();
            const expiryDay = new Date(expiry_date);

            if(today.getDay() == expiryDay.getDay()){
                throw new Error('Bet expiry must be at least tomorrow!');
            }
        }
        
        return await db('games').insert({
            game_id : game_id || crypto.createHash('SHA256').update(game_title + minimum_bet + increment + expiry_date + available_to + new Date().toDateString()).digest('hex'),
            game_title,
            minimum_bet,
            increment,
            expiry_date : expiry_date == '' ? 'When Closed' : expiry_date,
            created_by,
            available_to,
            type,
            options : type === 'Boolean' ? 'Kyllä;Ei' : options,
        });
    }

    async deleteGame(game_id){
        return await db('games').where({game_id}).del();
    }

    async insertNotification(notification){
        const {username, message} = notification;
        return await db('notifications').insert({
            username,
            message,
            game_id,
            game_title,
            notification_id : crypto.createHash('SHA256').update(username + message + new Date().getTime()).digest('hex'),
        });
    }

    async deleteNotification(notification_id){
        return await db('notifications').where({notification_id}).del();
    }

    async getNotifications(username){
        return await db('notifications').where({username});
    }

    async getGame(game_id){
        return await db('games').where({game_id}).first();
    }

    async updateGame(game){
        return await db('games').where({game_id : game.game_id}).update(game);
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