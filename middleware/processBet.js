const db = require('../models/db.js');

module.exports.processBet = async (req, res, next) => {
    try{
        const user = req.user;
        const bet = req.body;
        const game = await db.getGame(bet.game_id);
        const previousBet = await db.getBet(bet.game_id, user.username);
        
        if(previousBet && previousBet.folded){
            res.status(400).send('You cannot bet as you have folded!');
        }
        else if(bet.folded){
            res.status(400).send('There is no bet to fold!');
        }
        else if(bet.amount > user.balance){
            res.status(400).send('Bet amount exceedes your balance!');
        }
        else if(bet.amount < game.minimum_bet){
            res.status(400).send('Bet amount must be at least the minimum game bet!');
        }
        else{
            req.game = game;
            req.previousBet = previousBet;
            req.user.balance -= parseFloat(bet.amount);
            next();
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send();
    }
}