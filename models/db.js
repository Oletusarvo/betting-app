const replacer = require('../backend/js/replacer')
const db  = require('../dbConfig');

module.exports = {
    add,
    get,
    update,
    addBank,
    addAccount,
    getAccount,
    getAllAccounts,
    updateAccount,
    getBank,
    updateBank,
    addGame,
    getGame,
    updateGame,
};

async function update(gameData, bankData){
    return await db('data_table').where({id : 1}).update({
        game_data : JSON.stringify(gameData, replacer),
        bank_data : JSON.stringify(bankData, replacer)
    });
}

async function add(data){
   return await db('data_table').insert(data, ['id']); //Data must be an object containing both the game and bank json strings.
}

function get(){
    return db('data_table').first();
}

async function addAccount(account){
    //TODO: Prevent adding multiple accounts with the same username.
    return await db('account_table').insert({
        balance : account.balance,
        debt : account.balance,
        username : account.username,
        profit : account.profit,
        init_balance : account.initBalance
    }, ['username']);

    //return getAccount(account.username);
}

async function getAccount(username){
    return await db('account_table').where({username}).first();
}

function getAllAccounts(){
    return db('account_table');
}

async function updateAccount(data){
    return await db('account_table').where({username : data.username}).update({
        balance : data.balance,
        profit : data.profit,
        debt : data.debt,
        init_balance : data.initBalance,
        username : data.username
    });
}

async function addBank(bank){
    const [circulation, currencySymbol, defaultIssueAmount] = bank;
    return await db('bank_table').insert({
        circulation : circulation,
        currencySymbol : currencySymbol,
        defaultIssueAmount : defaultIssueAmount,
        accounts : JSON.stringify(bank.accounts, replacer),
        bank_name : bank.bankName
    }, ['bank_name']);
}

function getBank(id){
    return db('bank_table').where({id}).first();
}

async function updateBank(data){
    return db('bank_table').where({bank_name : data.bank_name}).update({
        circulation : data.circulation,
        default_issue_amount : data.defaultIssueAmount
    });
}

async function addGame(game){
    return await db('game_table').insert({
        bets : JSON.stringify(game.placedBets, replacer),
        pool : game.pool,
        min_bet : game.minBet,
        game_name : game.gameName
    }, ['game_name']);
}

function getGame(gameName){
    return db('game_table').where({game_name : gameName}).first();
}

async function updateGame(gameData){
    return db('game_table').where({game_name : game_name}).update({
        pool : gameData.pool,
        min_bet: gameData.minBet,
        placed_bets : JSON.stringify(gameData.placedBets, replacer)
    });
}


