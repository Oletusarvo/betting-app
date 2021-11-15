const Account = require('./account');

class Bank{
    constructor(){
        this.circulation = 0;
        this.defaultIssueAmount = 100;
        this.currencySymbol = "mk";
        this.accounts = new Map();
    }

    addAccount(id){
        const acc = new Account(id);
        this.fund(acc);
        this.accounts.set(acc.id, acc);
    }

    loan(accountId, amount){
        const acc = this.accounts.get(accountId);
        acc.deposit(amount);
        acc.debt += amount;
        this.circulation += amount;
    }

    payDebt(accountId, amount){
        const acc = this.accounts.get(accountId);
        acc.deposit(-amount);
        acc.debt -= amount;
        acc.circulation -= amount;
    }

    deposit(accountId, amount){
        const acc = this.accounts.get(accountId);
        acc.deposit(amount);
    }

    /**@private */
    fund(acc){
        acc.balance = this.defaultIssueAmount;
        this.circulation += this.defaultIssueAmount;
        acc.initBalance = acc.balance;
        acc.debt = acc.balance;
    }
}

module.exports = Bank;