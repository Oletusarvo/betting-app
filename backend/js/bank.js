const Account = require('./account');

class Bank{
    constructor(){
        this.circulation = 0;
        this.supply = 0;
        this.defaultIssueAmount = 100;
        this.currencySymbol = "mk";
        this.accounts = new Map();
    }

    addAccount(username){
        const acc = new Account(username);
        this.accounts.set(acc.id, acc);
        this.loan(acc.id, this.defaultIssueAmount);
        acc.initBalance = acc.balance;
    }
    
    loan(accountId, amount){
        const acc = this.accounts.get(accountId);
        acc.deposit(amount);
        acc.debt += amount;

        this.circulation += amount;
        this.supply += amount;
    }

    payDebt(accountId, amount){
        const acc = this.accounts.get(accountId);
        acc.deposit(-amount);
        acc.debt -= amount;
        this.circulation -= amount;
    }

    deposit(accountId, amount){
        const acc = this.accounts.get(accountId);
        acc.deposit(amount);
    }
}

module.exports = Bank;