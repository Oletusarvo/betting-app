class Account{
    constructor(id, password){
        this.balance = 0;
        this.initBalance = 0;
        this.debt = 0;
        this.profit = 0;
        this.username = id;
        this.password = password;
        this.isLoggedIn = false;
    }

    deposit(amount){
        this.balance += amount;
    }

    sendUpdate(socket){
        socket.emit('account_update', JSON.stringify({
            balance : this.balance,
            debt : this.debt,
            profit : this.profit
        }));
    }

    saveData(db){
        db.getAccount(this.username).then(data => {
            if(data){
                db.updateAccount(this).then(data => {
                    console.log(`Account \'${this.username}\' updated data.`);
                })
                .catch(err => {
                    console.log(`Failed to update account \'${this.username}\'!`, err);
                });
            }
            else{
                db.addAccount(this).then(data => {
                    console.log(`Account \'${this.username}\' saved data.`);
                })
                .catch(err => {
                    console.log(`Failed to save account \'${this.username}\'`, err);
                });
            }
        })
        .catch(err => {
            console.log(`Unable to get data for account \'${this.username}\'`, err);
        });
    }

    /**@deprecated */
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