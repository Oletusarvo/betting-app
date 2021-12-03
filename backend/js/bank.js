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

    load(data){
        this.circulation = data.circulation;
        this.defaultIssueAmount = data.default_issue_amount;
        this.currencySymbol = data.currency_symbol;
        this.accounts = data.accounts;
        this.bankName = data.bank_name;
    }

    addAccount(username, password){
        const acc = new Account(username, password);
        this.fund(acc);
        this.mint();
        this.accounts.set(username, acc);
    }

    sendUpdate(socket){
        socket.emit('bank_update', JSON.stringify({
            circulation : this.circulation,
            currencySymbol : this.currencySymbol
        }));
    }

    saveData(db){
        db.getBank(this.bankName).then(data => {
            if(data){
                db.updateBank(this).then(data => {
                    console.log(`Bank \'${this.bankName}\' updated data.`);
                })
                .catch(err => {
                    console.log('Failed to update bank!');
                })
            }
            else{
                db.addBank(this).then(data => {
                    console.log(`Bank \'${this.bankName}\' saved data.`);
                })
                .catch(err => {
                    console.log(`Failed to save bank \'${this.bankName}!\'`);
                })
            }
        });
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

    hasFunds(username, amount){
        const acc = this.accounts.get(username);
        return acc.balance >= amount;
    }

    setProfit(username){
        this.accounts.get(username).setProfit();
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