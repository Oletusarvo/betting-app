const Account = require("./account");
const Bank = require("./bank");
const Bet = require("./bet");
const Game = require("./game");

function replacer(key, value) {
    if(value instanceof Map) {
        return {
            dataType: 'Map',
            value: [...value]
        };
    }
    
    else if(value instanceof Game){
        return {
            dataType : 'Game',
            value : {
                pool : value.pool,
                minBet : value.minBet,
                gameName : value.gameName,
                placedBets : {dataType : 'Map', value : [...value.placedBets]}
            }
        };
    }
    
    else if(value instanceof Account){
        return{
            dataType : 'Account',
            value : {
                balance : value.balance,
                debt : value.debt,
                profit : value.profit,
                id : value.id,
                initBalance : value.initBalance,
                isLoggedIn : value.isLoggedIn
            }
        };
    }
    
    else if(value instanceof Bet){
        return {
            dataType : 'Bet',
            value : {
                id : value.id,
                hasToCall : value.hasToCall,
                side : value.side,
                amount : value.amount,
                folded : value.folded
            }
        };
    }
    
    else if(value instanceof Bank){
        return {
            dataType : 'Bank',
            value : {
                circulation : value.circulation,
                defaultIssueAmount : value.defaultIssueAmount,
                currencySymbol : value.currencySymbol,
                accounts : {dataType : 'Map', value : [...value.accounts]}
            }
        };
    }
    else{
        return value;
    }
}

module.exports = replacer;