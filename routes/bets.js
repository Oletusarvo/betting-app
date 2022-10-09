const router = require('express').Router();
const { checkAuth } = require('../middleware/checkAuth');
const { processBet } = require('../middleware/processBet');

const {game} = require('../models/db.js');

router.get('/', checkAuth, async (req, res) => {
    try{
        const {username, id} = req.query;
        const game = await (new Game()).load(id);
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
        const {amount, id, username, side} = req.body;
        const game = await (new Game()).load(id);

        await game.placeBet({
            amount,
            id,
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
        const {username, id} = req.body;
        await game.load(id);
        const bet = await game.fold(username);
        res.status(200).send(JSON.stringify(bet));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;