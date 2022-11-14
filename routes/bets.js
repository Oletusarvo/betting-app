const router = require('express').Router();
const {Game} = require('../utils/environment');
const { checkAuth } = require('../middleware/checkAuth');
const { processBet } = require('../middleware/processBet');

const {game} = require('../dbConfig');

router.get('/', checkAuth, async (req, res) => {
    try{
        const {username, id} = req.query;
        const game = await Game.loadGame(id);
        const bet = await game.getBet(username);
        res.status(200).send(JSON.stringify(bet));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/fold', checkAuth, async (req, res) => {
    try{
        const {username, id} = req.body;
        const game = await Game.loadGame(id);
        const bet = await game.fold(username);
        res.status(200).send(JSON.stringify(bet));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;