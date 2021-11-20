const Account = require("./account");
const Bank = require("./bank");
const Bet = require("./bet");
const Game = require("./game");

class JSONutil{
    replacer(key, value) {
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
                    balance : value.balance.toString(),
                    debt : value.debt.toString(),
                    profit : value.profit,
                    id : value.id,
                    initBalance : value.initBalance
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
                    supply : value.supply,
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
    
    reviver(key, value) {
        if (typeof value === 'object' && value != null) {
            if(value.dataType == 'Map'){
                return new Map(value.value);
            }
            
            if(value.dataType === 'Game'){
                const game = new Game();
                game.pool = parseFloat(value.value.pool);
                game.minBet = value.value.minBet;
                game.gameName = value.value.gameName;
                game.placedBets = new Map(value.value.placedBets);

                return game;
            }

            if(value.dataType === 'Account'){
                const acc = new Account(value.value.id);
                acc.balance = parseFloat(value.value.balance);
                acc.debt = parseFloat(value.value.debt);
                acc.initBalance = parseFloat(value.value.initBalance);
                acc.profit = parseFloat(value.value.profit);

                return acc;
            }
            
            if(value.dataType === 'Bet'){
                const bet = new Bet(value.value.amount, value.side, value.id);
                bet.folded = value.value.folded;
                bet.hasToCall = value.value.hasToCall;
                return bet;
            }
            
            if(value.dataType === 'Bank'){
                const bank = new Bank();
                bank.circulation = value.value.circulation;
                bank.supply = value.value.supply;
                bank.accounts = new Map(value.value.accounts);
                bank.defaultIssueAmount = value.value.defaultIssueAmount;
                bank.currencySymbol = value.value.currencySymbol;
                return bank;
            }
            
        }
        
        return value;
       
    }
}

module.exports = JSONutil;
