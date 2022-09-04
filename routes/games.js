const router = require('express').Router();
const db = require('../models/db.js');
const checkAuth = require('../middleware/checkAuth.js').checkAuth;
const processBet = require('../middleware/processBet.js').processBet;

router.get('/', async (req, res) => {
    const gamelist = await db.getGamelist();
    res.status(200).send(JSON.stringify(gamelist));
});

router.get('/by_user/:id', checkAuth, async (req, res) => {
    try{
        const username = req.params.id;
        const gamelist = await db.getGamesCreatedBy(username);
        res.status(200).send(JSON.stringify(gamelist));
    }
    catch(err){
        console.log(err);
    }
   
});

router.get('/:id', checkAuth, async (req, res) => {
    const game_id = req.params.id;
    const game = await db.getGame(game_id);
    res.status(200).send(JSON.stringify(game));
});

router.post('/', checkAuth, async (req, res) => {
    const {game_title, minimum_bet, expiry_date, created_by, increment} = req.body;
    console.log(req.body);

    try{
        await db.insertGame(game_title, created_by, minimum_bet, expiry_date, increment);
        res.status(200).send();
    }
    catch(err){
        res.status(500).send(err);
    }
});

router.delete('/:id', checkAuth, async (req, res) => {
    try{
        const id = req.params.id;
        const {side} = req.body;
        const list = await db.closeGame(id, side);
        res.status(200).send(JSON.stringify(list));
    }
    catch(err){
        res.status(500).send(err.message);
    }
    
  
});

module.exports = router;