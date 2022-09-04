const db = require('../dbConfig.js');
const crypto = require('crypto');

function consolidateAmount(bets){
    //Returns the consolidated amount of bets by username
    return bets.reduce((acc, cur) => acc + cur.amount, 0);
}

function isFolded(bets){
    for(let bet of bets){
        if(bet.folded == 1){
            return true;
        }
    }

    return false;
}

function sidesMatch(bets, side){
    for(let bet of bets){
        if(bet.side !== side){
            return false;
        }
    }

    return true;
}

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

        for(let username of participants){
            const prevBet = await module.exports.calculateTotalBet(game_id, username);
            if(prevBet < minimumBet){
                hasToCall.push(username);
            }
        }

        return hasToCall;
    },

    getBet : async (game_id, username) => {
        return await db('bets').where({username, game_id}).first();
    },

    addNotification : async (username, game_id, game_title, message) => {
        return await db('notifications').insert({
            username,
            game_id,
            game_title,
            message
        });
    },

    getNotifications : async (username) => {
        return await db('notifications').where({username});
    },

    closeGame : async (game_id, side) => {
        side = side === 'y' || side === 'Y' ? 'Kyllä' : 'Ei';

        const {game_title, pool, expiry_date} = await module.exports.getGame(game_id);
        const today = new Date().getTime();
        const expiry = new Date(expiry_date).getTime();

        if(expiry_date !== 'When Closed' && today < expiry){
            throw new Error('Cannot close the bet before it\'s expiry date!');
        }

        const participants = await db('bets').where({game_id});

        const winners = participants.filter(item => item.folded == 0 && item.side === side);

        const winningShare = pool / winners.length;

        for(let winner of winners){
            const acc = await module.exports.getAccount(winner.username);
            await module.exports.updateAccount(winner.username, acc.balance + winningShare);
            await module.exports.addNotification(winner.username, game_id, game_title, `Won \$${winningShare}!`);
        }

        await db('bets').where({game_id}).del();
        await db('games').where({game_id}).del();

        return await db('games');
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

        return await db('games').where({game_id}).update({
            pool : game.pool,
            minimum_bet : game.minimum_bet
        });
    },

    getBetsByUsername : async (game_id, username) => {
        return await db('bets').where({game_id, username});
    },

    getBets : async (game_id) => {
        return await db('bets').where({game_id});
    },

    placeBet : async (game_id, username, amount, side) => {
       const game           = await module.exports.getGame(game_id);
       const account        = await module.exports.getAccount(username);
       let bet              = await module.exports.getBet(game_id, username);
       const amountParsed   = parseFloat(amount);

       if(bet){
            bet.amount += amountParsed;
            await db('bets').where({username, game_id}).update(bet);
       }
       else{
            bet = await db('bets').insert({
                username,
                amount,
                game_id,
                side,
            });
       }

       if(bet.amount > game.minimum_bet){
            game.minimum_bet = bet.amount;
       }

       game.pool        += parseFloat(amount);
       account.balance  -= parseFloat(amount);

       await db('games').where({game_id}).update(game);
       await db('accounts').where({username}).update(account);
    },

    foldBet : async (game_id, username) => {
        await db('bets').where({game_id, username}).update({
            folded : true
        });

        return db('bets').where({game_id, username}).first();
    }
}