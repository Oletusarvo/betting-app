const db = require('../dbConfig');
const currency = require('../currencyfile');
const Game = require('./game');

class LottoGame extends Game{
    constructor(data){
        super(data);
        this.numbers = [];
        for(let n = 1; n < 40; ++n) this.numbers.push(n);
    }

    async close(){
        super.checkClose();
        this.shuffle(20);
        const draw = this.generateRow();
        const results = this.getResults(draw);
        const winners = results.filter(item => item.matches >= this.data.lotto_row_size);
        const creatorShare = super.calculateCreatorShare(winners.length);
        const reward = super.calculateReward(winners.length, creatorShare);

        if(winners.length == 0){
            this.data.pool_reserve += this.data.pool;
            this.data.pool = 0;
            this.bets = [];
            await db('bets').where({game_id: this.data.id}).del();
            this.update();
            return;
        }

        for(const winner of winners) await super.accountDeposit(winner.username, reward);

        await super.close();
    }   

    shuffle(numShuffles){
        for(let i = 0; i < numShuffles; ++i) this.numbers.sort(() => Math.random() >= 0.5 ? 1 : -1);
    }

    getResults(result){
        //Returns the number of matches each participant had on their row.
        const results = [];
        console.log(result);
        this.bets.forEach(bet => {
            const row = bet.side.split(',');
            const matches = this.compareRows(row, result);
            results.push({
                username: bet.username,
                matches,
            });
        });
        return results;
    }

    countWinnersWithMatches(winners, matches){
        let count = 0;
        winners.forEach(winner => count += winner.matches == matches);
        return count;
    }

    generateRow(){
        return this.numbers.slice(0, this.data.lotto_draw_size).sort((a, b) => a - b);
    }

    compareRows(row1, row2){
        let matches = 0;
        for(let i = 0; i < row1.length; ++i){
            for(let j = 0; j < row2.length; ++j){
                matches += row1[i] == row2[j];
            }
        }
        return matches;
    }
}



export default LottoGame;