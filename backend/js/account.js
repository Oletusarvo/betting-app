class Account{
    constructor(id){
        this.balance = 0;
        this.initBalance = 0;
        this.debt = 0;
        this.profit = 0;
        this.username = id;
        this.isLoggedIn = false;
    }

    deposit(amount){
        this.balance += amount;
    }

    setProfit(){
        this.profit = this.balance - this.initBalance;
    }

    loan(amount){
        this.deposit(amount);
        this.debt += amount;
    }

    payDebt(amount){
        this.deposit(-amount);
        this.profit += amount > this.debt ? -(amount - this.debt) : 0;
        this.debt -= amount >= this.debt ? this.debt : amount;
    }
}

module.exports = Account;