const db = require('../dbConfig.js');
const crypto = require('crypto');
module.exports = {

    insertGame : async (game_title, created_by, minimum_bet = 0.01, expiry_date = '', increment = 0.01) => {
        return await db('games').insert({
            game_id : crypto.createHash('SHA256').update(JSON.stringify(game_title + minimum_bet + expiry_date)).digest('hex'),
            game_title,
            expiry_date : expiry_date == '' ? 'When Closed' : expiry_date,
            minimum_bet,
            created_by,
            increment
        });
    },

    deleteGame : async (game_id) => {
        return await db('games').where({game_id}).del();
    },

    getGame : async (game_id) => {
        return await db('games').where({game_id}).first();
    },

    getGamesCreatedBy : async (username) => {
        return await db('games').where({created_by : username});
    },  
     
    insertAccount : async (username, password) => {
        return await db('accounts').insert({
            username,
            password
        });
    },

    getAccount : async (username) => {
        return await db('accounts').where({username}).first();
    },

    updateAccount : async (username, balance) => {
        return await db('accounts').where({username}).update({
            balance
        });
    },

    getGamelist : async () => {
        return await db('games');
    },

    deleteGame : async (game_id) => {
        return await db('games').where({game_id}).del();
    },

    updateGame : async (game_id, pool, minimum_bet) => {
        return await db('games').where({game_id}).first().update({
            pool,
            minimum_bet
        });
    },

    getBetInGame : async (game_id, username) => {
        return await db('bets').where({game_id, username}).first();
    },

    getAllBetsInGame : async (game_id) => {
        return await db('bets').where({game_id});
    },

    placeBet : async (game_id, username, amount) => {
        return await db('bets').insert({
            username,
            amount,
            game_id
        });
    },

    updateBet : async (game_id, username, amount) => {
        return await db('bets').where({game_id, username}).first().update({
            amount
        });
    },

    foldBet : async (game_id, username) => {
        return await db('bets').where({game_id, username}).first().update({
            folded : true
        });
    }
}