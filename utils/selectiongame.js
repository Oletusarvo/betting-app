const db = require('../dbconfig');
const Game = require('./game');
const currency = require('../currencyfile');

class SelectionGame extends Game{
    constructor(data){
       super(data);
    }

    isContested(){
        const mustCall = super.getMustCall();
        return mustCall.length;
    }

    getWinners(side){
       return this.bets.filter(bet => !bet.folded && bet.side === side).map(item => item.username);
    }

    checkClose(){
        super.checkClose();
        if(this.isContested()) super.autoFold();
    }

    async close(side){
        this.checkClose();
        let winners =  this.getWinners(side);
        const creatorReward = this.calculateCreatorShare(winners.length);
        const reward = this.calculateReward(winners.length, creatorReward);

        winners = winners.map(username => {
            return {
                username, reward
            }
        });

        winners.push({ username: this.data.created_by, reward: creatorReward, });

        for(const winner of winners){
            const {username, reward} = winner;
            if(reward != 0) {
                await this.accountDeposit(username, reward);
                await this.notify(username, `Voitit ${currency.symbol + reward}`);
            }
        }

        await super.close();
    }
}

module.exports = SelectionGame;