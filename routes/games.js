const router = require('express').Router();
const {database, bank, game} = require('../models/db.js');
const db = require('../dbConfig');
const checkAuth = require('../middleware/checkAuth.js').checkAuth;
const processBet = require('../middleware/processBet.js').processBet;
const crypto = require('crypto');
router.get('/', async (req, res) => {
    const {game_title} = req.query;

    let gamelist;
    const allGames = await db('games');
    if(game_title){
        const re = new RegExp(game_title.toLowerCase());
        gamelist = allGames.filter(game => re.test(game.game_title.toLowerCase()));
    }
    else{
        gamelist = allGames;
    }
    
    res.status(200).send(JSON.stringify(gamelist));
});

router.get('/data', checkAuth, async (req, res) => {
    try{
        const {username, game_id} = req.query;
        await game.load(game_id);
        const bet = await game.getBet(username);
        const gameData = game.data();

        res.status(200).send(JSON.stringify({
            game: gameData, bet
        }));
    }
    catch(err){
        res.status(500).send(err.message);
    }
    
});

router.get('/by_user/:id', checkAuth, async (req, res) => {
    try{
        const username = req.params.id;
        const gamelist = await database.getGamesByUser(username);
        res.status(200).send(JSON.stringify(gamelist));
    }
    catch(err){
        console.log(err);
    }
});

router.get('/:id', checkAuth, async (req, res) => {
    const game_id = req.params.id;
    await game.load(game_id);
    
    res.status(200).send(JSON.stringify(game));
});

router.post('/', checkAuth, async (req, res) => {
    try{
        const data = req.body;
        await database.insertGame(data);
        res.status(200).send();
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

router.delete('/:id', checkAuth, async (req, res) => {
    try{
        const id = req.params.id;
        const {side} = req.body;

        await game.load(id);
        await game.close(side);

        const list = await database.getGamesByUser(req.user.username);
        res.status(200).send(JSON.stringify(list));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;