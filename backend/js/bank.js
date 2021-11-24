const Account = require('./account');
const error = require('./error');

class Bank{
    constructor(bankName = "default"){
        this.circulation = 0;
        this.defaultIssueAmount = 100;
        this.currencySymbol = "mk";
        this.accounts = new Map();
        this.bankName = bankName;
    }

    /**@private */
    fund(acc){
        acc.initBalance = acc.balance = this.defaultIssueAmount;
        
    }

    /**@private */
    mint(amount = this.defaultIssueAmount){
        this.circulation += amount;
    }

    addAccount(username){
        const acc = new Account(username);
        this.fund(acc);
        this.mint();
        this.accounts.set(username, acc);
    }
    
    loan(accountId, amount){
        /*
        if(typeof amount !== 'number') error("Bank error, Loan", "Amount has to be a number!");
        if(typeof accountId !== 'string') error("Bank error, Loan", "ID has to be a string!");
        */
        const acc = this.accounts.get(accountId);
        this.mint(amount);
        acc.loan(amount);
    }

    

    payDebt(accountId, amount){
        /*
        if(typeof amount !== 'number') error("Bank error, Pay debt", "Amount has to be a number!");
        if(typeof accountId !== 'string') error("Bank error, Pay debt", "ID has to be a string!");
        */
        const acc = this.accounts.get(accountId);
        acc.payDebt(amount);
        this.circulation -= amount; 
    }

    deposit(accountId, amount){
        /*
        if(typeof amount !== 'number') error("Bank error, deposit", "Amount has to be a number!");
        if(typeof accountId !== 'string') error("Bank error, deposit", "ID has to be a string!");
        */
        const acc = this.accounts.get(accountId);
        acc.deposit(amount);
    }
}

module.exports = Bank;