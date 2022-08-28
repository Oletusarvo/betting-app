const router = require('express').Router();
const db = require('../models/db.js');
const checkAuth = require('../middleware/checkAuth.js').checkAuth;

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
        res.status(500).send();
    }
});

router.delete('/', checkAuth, async (req, res) => {
    const id = req.body.id;
    try{
        await db.deleteGame(id);
        res.status(200).send();
    }
    catch(err){
        res.status(500).send();
    }
})

module.exports = router;