const db = require('../dbConfig');

class Account{
    constructor(data){
        this.data = data;
    }

    async load(username){
        this.data = await db.select('username', 'balance').from('users').where({username}).first();
    }

    async update(){
        await db.select('balance').from('users').where({username: this.data.username}).update({balance: this.data.balance});
    }

    verifyAmount(amount){
        return amount < 0 ? Math.abs(amount) <= this.data.balance : true;
    }

    async deposit(amount){
        //if(!this.verifyAmount(amount)) throw new Error('Amount exceedes balance!');
        this.data.balance += amount;
        await db('users').where({username: this.data.username}).increment('balance', amount);
    }
}

module.exports = Account;