class Account{
    constructor(id, balance = 0, currency = 'DICE'){
        this.id = id;
        this.balance = balance;
        this.currency = currency;
    }

    hasFunds(amount){
        return this.balance >= amount;
    }

    deposit(amount){
        this.balance += amount;
    }
}

export default Account;