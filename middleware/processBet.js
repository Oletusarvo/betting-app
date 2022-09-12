const {Game} = require('../models/db.js');

module.exports.processBet = async (req, res, next) => {
    try{
        const game = await (new Game()).load(req.body.game_id);
        await game.validateBet(req.body);
        next();

    }
    catch(err){
        res.status(400).send(err.message);
    }
}