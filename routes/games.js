const router = require('express').Router();
const db = require('../models/db.js');
const checkAuth = require('../middleware/checkAuth.js').checkAuth;
const processBet = require('../middleware/processBet.js').processBet;

router.get('/', checkAuth, async (req, res) => {
    const gamelist = await db.getGamelist();
    res.status(200).send(JSON.stringify(gamelist));
});

router.get('/:id', checkAuth, async (req, res) => {
    const username = req.params.id;
    const gamelist = await db.getGamesCreatedBy(username);
    res.status(200).send(JSON.stringify(gamelist));
});

router.post('/', checkAuth, async (req, res) => {
    const {game_title, minimum_bet, expiry_date, created_by, increment} = req.body;

    try{
        await db.insertGame(game_title, created_by, minimum_bet, expiry_date, increment);
        res.status(200).send();
    }
    catch(err){
        res.status(500).send(err);
    }
});

router.post('/bet', checkAuth, processBet, async (req, res) => {
    try{
        const {amount, game_id, username} = req.body;
        await db.placeBet(game_id, username, amount);
        await db.updateAccount(req.user.username ,req.user.balance);

        res.status(200).send(JSON.stringify({
            balance : req.user.balance
        }));
    }
    catch(err){
        console.log(err);
        res.status(500).send();
    }
});

router.delete('/', checkAuth, async (req, res) => {
    const {id, side} = req.body;
    try{
        await db.closeGame(id, side);
        res.status(200).send();
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;