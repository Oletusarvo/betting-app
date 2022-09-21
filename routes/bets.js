const router = require('express').Router();
const { checkAuth } = require('../middleware/checkAuth');
const { processBet } = require('../middleware/processBet');

const {game} = require('../models/db.js');

router.get('/', checkAuth, async (req, res) => {
    try{
        const {username, game_id} = req.query;
        const game = await (new Game()).load(game_id);
        const bet = await game.getBet(username);
        res.status(200).send(JSON.stringify(bet));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});
/*
router.post('/', checkAuth, async (req, res) => {
    try{
        const {amount, game_id, username, side} = req.body;
        const game = await (new Game()).load(game_id);

        await game.placeBet({
            amount,
            game_id,
            username,
            side
        });

        const gameData = JSON.stringify(game.data());
        req.io.emit('game_update', gameData);
        res.status(200).send();
    }
    catch(err){
        res.status(500).send(err.message);
    }
});
*/

router.post('/fold', checkAuth, async (req, res) => {
    try{
        const {username, game_id} = req.body;
        await game.load(game_id);
        const bet = await game.fold(username);
        res.status(200).send(JSON.stringify(bet));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;