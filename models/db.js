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
    }
}

class Game{
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
        this.game = await db('games').where({game_id : this.game.game_id}).first();
    }

    async load(game_id){
        this.game = await db('games').where({game_id}).first();
        return this;
    }

    async placeBet(bet){
        await this.validateBet(bet);
        const {username, amount} = bet;
        const previousBet = await this.getBet(username);

        if(previousBet){
            const combinedAmount = previousBet.amount + amount;
            if(combinedAmount > this.game.minimum_bet){
                this.game.minimum_bet = combinedAmount;
            }

            bet.amount = combinedAmount;

            await db('bets').where({username, game_id : this.game.game_id}).update(bet);
        }
        else{
            if(amount > this.game.minimum_bet){
                this.game.minimum_bet = amount;
            }

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

        const now = new Date().getTime();
        const expiry = new Date(this.game.expiry_date).getTime();

        if(now < expiry){
            throw new Error('Cannot close the game before its expiry date!');
        }

        side = side == 'Y' || side == 'y' ? 'Kyllä' : 'Ei';
        const participants = await this.getAllBets();
        const winners = participants.filter(item => item.side == side && item.folded != true);
        const share = Math.round(this.game.pool / winners.length);

        const bank = new Bank();
        for(let winner of winners){
            await bank.deposit(winner.username, share);
        }

        await db('bets').where({game_id : this.game.game_id}).del();
        await db('games').where({game_id : this.game.game_id}).del();
    }

    data(){
        const {game_title, game_id, pool, minimum_bet, created_by, expiry_date, increment} = this.game;
        return {
            game_title,
            game_id,
            pool,
            minimum_bet,
            created_by,
            expiry_date,
            increment
        }
    }

    async validateBet(bet){
        const {username, side, amount} = bet;
        const bank = new Bank();

        const previousBet = await this.getBet(username);
        const account = await bank.getAccount(username);

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
            
            if(previousAmount >= this.game.minimum_bet){
                throw new Error('Cannot raise until minimum bet has changed!');
            }
            
            if(combinedAmount < this.game.minimum_bet){
                throw new Error('Amount must be at least the minimum bet amount!');
            }

            if(previousSide !== side){
                throw new Error('Side switching disallowed!');
            }
        }
        else{
            if(amount < this.game.minimum_bet){
                throw new Error('Amount must be at least the minimum bet amount!');
            }
        }
    }
}

class Database{
    async insertGame(game){
        const {game_title, minimum_bet, increment, expiry_date, available_to, created_by} = game;
        return await db('games').insert({
            game_id : crypto.createHash('SHA256').update(game_title + minimum_bet + increment + expiry_date + available_to + new Date().toDateString()).digest('hex'),
            game_title,
            minimum_bet,
            increment,
            expiry_date : expiry_date == '' ? 'When Closed' : expiry_date,
            created_by,
            available_to
        });
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

module.exports = {Bank, Database, Game}