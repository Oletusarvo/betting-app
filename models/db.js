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

        return await db('games').where({game_id}).update({
            pool : game.pool,
            minimum_bet : game.minimum_bet
        });
    },

    getBetsInGame : async (game_id, username) => {
        return await db('bets').where({game_id, username});
    },

    getBetsInGameConsolidated : async (game_id, username) => {
        const bets = await db('bets').where({game_id, username});
        let bet = {
            amount : 0,
            side : bets.length > 0 ? bets[0].side : 'none',
            folded : bets.length > 0 ? bets[0].folded : false,
        }

        for(let item of bets){
            bet.amount += item.amount;
        }

        return bet;
    },

    getAllBetsInGame : async (game_id) => {
        return await db('bets').where({game_id});
    },

    placeBet : async (game_id, username, amount, side) => {
        const {minimum_bet, game_title}     = await db('games').where({game_id}).first();
        const {balance}         = await db('accounts').where({username}).first();
        const amountParsed      = parseFloat(amount);
        const previousBets      = await db('bets').where({username, game_id});
        
        if(amount == ''){
            throw new Error('Amount cannot be empty!');
        }

        let folded = isFolded(previousBets);
        if(folded){
            throw new Error('You have folded! Cannot participate.');
        }

        if(!sidesMatch(previousBets, side)){
            throw new Error('Cannot switch sides on a bet underway!');
        }

        const consolidatedAmount = consolidateAmount(previousBets);
        const call = consolidatedAmount < minimum_bet;
        if(!call){
            throw new Error('Cannot update bet until you have to call a previous bet!');
        }

        const totalAmount = consolidatedAmount + amountParsed;
        if(totalAmount < minimum_bet){
            throw new Error('Amount must be at least the minimum bet!');
        }

        if(amountParsed > balance){
            throw new Error('Amount exceedes your account balance!');
        }

        await db('bets').insert({
            username,
            amount,
            game_id,
            side
        });

        await db('accounts').where({username}).update({
            balance : balance - amount
        });

        const hasToCall = await module.exports.getHasToCall(game_id);
        for(let item of hasToCall){
            await module.exports.addNotification(item, game_id, game_title, 'Time to make a call!');
        }

        return await module.exports.updateGame(game_id);
    },

    foldBet : async (game_id, username) => {
        return await db('bets').where({game_id, username}).update({
            folded : true
        });
    }
}