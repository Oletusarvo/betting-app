const db = require('../models/db.js');

module.exports.processBet = async (req, res, next) => {
    try{
        const user = req.user;
        const bet = req.body;
        const game = await db.getGame(bet.game_id);
        const previousBet = await db.getBet(bet.game_id, user.username);

        if(previousBet){
            if(previousBet.folded){
                res.status(400).send('You have folded!');
                return;
            }

            if(bet.side !== previousBet.side){
                res.status(400).send('Side switching not allowed!');
                return;
            }

            //Can only bet if calling.
            if(previousBet.amount >= game.minimum_bet){
                res.status(400).send('Cannot raise bet until minimum bet changes!');
                return;
            }

            if(bet.amount > user.balance){
                //TODO: implement side-pot.
                res.status(400).send('Amount exceedes your balance!');
                return;
            }
        }
        else{
            if(bet.folded){
                res.status(400).send('There is no bet to fold!');
                return;
            }

            if(bet.amount > user.balance){
                res.status(400).send('Amount exceedes your balance!');
                return;
            }

            if(bet.amount < game.minimum_bet){
                res.status(400).send('Amount must be at least the minimum bet amount!');
                return;
            }
        }

        req.game = game;
        req.previousBet = previousBet;
        req.user.balance -= parseFloat(bet.amount);
        next();

    }
    catch(err){
        console.log(err);
        res.status(500).send();
    }
}