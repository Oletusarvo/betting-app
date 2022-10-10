const db = require('../dbConfig');
const crypto = require('crypto');

module.exports = new class {
    async addGame(game){
        game.id = crypto.createHash('SHA256').update(game + new Date().getTime()).digest('hex');
        game.options = game.type === 'Boolean' ? 'Kyllä;Ei' : game.options;
        game.expiry_date = game.expiry_date === '' ? 'When Closed' : game.expiry_date;
        await db('games').insert(game);
    }
    
    async getGame(id){
        return await db('games').where({id}).first();
    }

    async getGames(){
        return await db('games');
    }

    async getGamesByUser(username){
        return await db('games').where({created_by: username});
    }
    
    async deleteGame(id){
        await db('games').where({id}).delete();
    }

    async updateGame(game){
        const {id} = game;
        await db('games').where({id}).update(game);
    }
    
    async addBet(bet){
        await db('bets').insert(bet);
    }
    
    async getBet(username, game_id){
        return await db('bets').where({username, game_id}).first();
    }

    async updateBet(bet){
        const {game_id, username} = bet;
        await db('bets').where({username, game_id}).update(bet)
    }

    async deleteBets(game_id){
        await db('bets').where({game_id}).delete();
    }

    async getBets(game_id){
        return await db('bets').where({game_id});
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

    async updateAccount(acc){
        const {username} = acc;
        await db('accounts').where({username}).update(acc);
    }

    async deleteAccount(username){
        await db('accounts').where({username}).del();
    }

    async addNote(note){
        await db('notes').insert(note);
    }

    async getNotes(username){
        return await db('notes').where({username});
    }

    async deleteNote(id){
        await db('notes').where({id}).delete();
    }
};