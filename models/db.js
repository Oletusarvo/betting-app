const db = require('../dbConfig.js');
const crypto = require('crypto');
module.exports = {

    insertGame : async (game_title, created_by, minimum_bet = 0.01, expiry_date = '', increment = 0.01, available_to = '') => {
        return await db('games').insert({
            game_id : crypto.createHash('SHA256').update(JSON.stringify(game_title + minimum_bet + expiry_date + new Date().toDateString())).digest('hex'),
            game_title,
            expiry_date : expiry_date == '' ? 'When Closed' : expiry_date,
            minimum_bet,
            created_by,
            increment,
            available_to
        });
    },

    getParticipants : async (game_id) => {
        const bets = await db('bets').where({game_id});
        const participants = [];
        bets.forEach(item => {
            if(!participants.includes(item.username)){
                participants.push(item.username);
            }
        });

        return participants;
    },

    calculatePool : async (game_id) => {
        const bets = await db('bets').where({game_id});
        let total = 0;

        for(let item of bets){
            total += item.amount;
        }
        
        return total;
    },

    calculateTotalBet : async (game_id, username) => {
        const bets = await db('bets').where({game_id, username});

        let total = 0;
        for(let item of bets){
            total += item.amount;
        }

        return total;
    },  

    calculateMinimumBet : async (game_id) => {
        const bets = await db('bets').where({game_id});
        const participants = await module.exports.getParticipants(game_id);

        const pools = [];
        for(let item of participants){
            const total = await module.exports.calculateTotalBet(game_id, item);
            pools.push(total);
        }

        return Math.max(...pools);
    },

    getHasToCall : async (game_id) => {
        const bets = await db('bets').where({game_id});
        const participants = await module.exports.getParticipants(game_id);
        const minimumBet = await module.exports.calculateMinimumBet(game_id);

        const hasToCall = [];

        for(let item of participants){
            const prevBet = await module.exports.calculateTotalBet(game_id, item);
            if(prevBet < minimumBet){
                hasToCall.push({
                    username : item,
                    amount : minimumBet - prevBet
                });
            }
        }

        return hasToCall;
    },

    deleteGame : async (game_id) => {
        await db('bets').where({game_id}).del();
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
            password,
            balance : 100
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

    updateGame : async (game_id) => {
        const game = await module.exports.getGame(game_id);
        game.pool = await module.exports.calculatePool(game_id);
        game.minimum_bet = await module.exports.calculateMinimumBet(game_id);

        return await db('games').where({game_id}).update(game);
    },

    getBetsInGame : async (game_id, username) => {
        return await db('bets').where({game_id, username});
    },

    getAllBetsInGame : async (game_id) => {
        return await db('bets').where({game_id});
    },

    placeBet : async (game_id, username, amount, side) => {
        const game = await db('games').where({game_id}).first();
        const account = await db('accounts').where({username}).first();
        const previousBet = await db('bets').where({game_id, username}).first();

        const amountParsed = parseFloat(amount);
        if(previousBet){
            if(previousBet.folded){
                throw new Error('Cannot participate as you have folded!');
            }

            const combinedAmount = previousBet.amount + amountParsed;
            if(combinedAmount > account.balance){
                throw new Error('Amount exceedes your balance!');
            }

            if(combinedAmount < game.minimum_bet){
                throw new Error('Amount must be at least the stated minimum!');
            }

            await db('bets').where({game_id, username}).update({
                amount : combinedAmount
            });
        }
        else{
            if(amountParsed > account.balance){
                throw new Error('Amount exceedes your balance!');
            }

            if(amountParsed < game.minimum_bet){
                throw new Error('Amount must be at least the stated minimum!');
            }
            await db('bets').insert({
                username,
                amount : amountParsed,
                game_id,
                side
            });
        }
        
        return await module.exports.updateGame(game_id);
    },

    foldBet : async (game_id, username) => {
        return await db('bets').where({game_id, username}).update({
            folded : true
        });
    }
}