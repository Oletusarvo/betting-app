class Account{
    constructor(id){
        this.balance = 0;
        this.initBalance = 0;
        this.debt = 0;
        this.profit = 0;
        this.id = id;
    }

    deposit(amount){
        this.balance += amount;
    }

    setProfit(){
        this.profit = this.balance - this.initBalance;
    }
}

module.exports = Account;