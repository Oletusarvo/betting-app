const replacer = require('../backend/js/replacer')
const db  = require('../dbConfig');

module.exports = {
    add,
    get,
    findById,
    updateGameData,
    updateBankData,
    getGameData,
    getBankData,
    addBank,
    addAccount,
    getAccount,
    getBank,
    addGame,
    getGame,
    database
};

async function add(data){
   return await db('data_table').insert(data, ['id']); //Data must be an object containing both the game and bank json strings.
}

async function addAccount(account){
    //TODO: Prevent adding multiple accounts with the same username.
    return await db('accounts').insert({
        balance : account.balance,
        debt : account.balance,
        username : account.username,
        profit : account.profit,
        init_balance : account.initBalance
    }, ['username']);

    //return getAccount(account.username);
}

async function getAccount(username){
    return await db('accounts').where({username});
}

async function addBank(bank){
    const [circulation, currencySymbol, defaultIssueAmount] = bank;
    return await db('banks').insert({
        circulation : circulation,
        currencySymbol : currencySymbol,
        defaultIssueAmount : defaultIssueAmount,
        accounts : JSON.stringify(bank.accounts, replacer)
    }, ['id']);
}

function getBank(id){
    return db('banks').where({id});
}

async function addGame(game){
    return await db('games').insert({
        bets : JSON.stringify(game.placedBets, replacer),
        pool : game.pool,
        min_bet : game.minBet,
        game_name : game.gameName
    }, ['game_name']);
}

function getGame(gameName){
    return db('games').where({game_name : gameName});
}

function findById(id){
    return db('data_table').where({id});
}

function get(){
    return db('data_table');
}

async function getBankData(){
    return await db('data_table').where({id : 1}).select('bank_data');
}

async function getGameData(){
    return await db('data_table').where({id : 1}).select('game_data');
}

async function updateBankData(data){
    return await db('data_table').where({id: 1}).update('bank_data', data);
}

async function updateGameData(data){
    return await db('data_table').where({id : 1}).update('game_data', data);
}

async function database(){
    return await db;
}
