const replacer = require('../backend/js/utils').replacer;
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
        password : account.password,
        profit : account.profit,
        init_balance : account.initBalance
    }, ['username']);
}

async function getAccount(username){
    return await db('account_table').where({username: username}).first();
}

function getAllAccounts(){
    return db('account_table');
}

async function updateAccount(data){
    return await db('account_table').where({username : data.username}).update({
        balance : data.balance,
        profit : data.profit,
        debt : data.debt,
        init_balance : data.initBalance
    });
}

async function addBank(bank){
    return await db('bank_table').insert({
        circulation : bank.circulation,
        currency_symbol : bank.currencySymbol,
        default_issue_amount : bank.defaultIssueAmount,
        //accounts : JSON.stringify(bank.accounts, replacer),
        bank_name : bank.bankName
    }, ['bank_name']);
}

function getBank(bankName){
    return db('bank_table').where({bank_name : bankName}).first();
}

async function updateBank(data){
    return await db('bank_table').where({bank_name : data.bankName}).update({
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

async function addBet(game){
    return await db('')
}

function getGame(gameName){
    return db('game_table').where({game_name : gameName}).first();
}

async function updateGame(data){
    //If a game name is changed, this will not find the game from the database.
    return await db('game_table').where({game_name : data.gameName}).update({
        pool : data.pool,
        min_bet: data.minBet,
        bets : JSON.stringify(data.placedBets, replacer),
        game_name : data.gameName
    });
}


