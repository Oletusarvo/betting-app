const router = require('express').Router();
const { checkAuth } = require('../middleware/checkAuth');
const { processBet } = require('../middleware/processBet');

const db = require('../models/db.js');

router.get('/', checkAuth, async (req, res) => {
    try{
        const {username, game_id} = req.query;
        const bet = await db.getBet(game_id, username);
        res.status(200).send(JSON.stringify(bet));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/', checkAuth, processBet, async (req, res) => {
    try{
        const {amount, game_id, username, side} = req.body;
        await db.placeBet(game_id, username, amount, side);

        const game = await db.getGame(game_id);
        req.io.emit('game_update', JSON.stringify(game));
        res.status(200).send(JSON.stringify(game));
    }
    catch(err){
        console.log(err);
        res.status(500).send();
    }
});

router.post('/fold', checkAuth, async (req, res) => {
    try{
        const {username, game_id} = req.body;
        const bet = await db.foldBet(game_id, username);
        res.status(200).send(JSON.stringify(bet));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;