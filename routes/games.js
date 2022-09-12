const router = require('express').Router();
const {Database, Bank, Game} = require('../models/db.js');
const checkAuth = require('../middleware/checkAuth.js').checkAuth;
const processBet = require('../middleware/processBet.js').processBet;

const database = new Database();

router.get('/', async (req, res) => {
    const gamelist = await database.getAllGames();
    res.status(200).send(JSON.stringify(gamelist));
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
    const game = await database.getGame(game_id);
    res.status(200).send(JSON.stringify(game));
});

router.post('/', checkAuth, async (req, res) => {
    try{
        const data = req.body;
        await database.insertGame(data);
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

        const game = await (new Game()).load(id);
        await game.close(side);

        const list = await database.getGamesByUser(req.user.username);
        res.status(200).send(JSON.stringify(list));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;