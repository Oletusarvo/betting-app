const router = require('express').Router();
const db = require('../dbConfig.js');
const crypto = require('crypto');
const {Game} = require('../utils/environment');
const checkAuth = require('../middleware/checkAuth.js').checkAuth;

router.get('/', async (req, res) => {
    const {title, username, followed} = req.query;

    let gamelist = [];
    if(title == undefined){
        if(username && followed){
            const followed = await db('follow_data').where({followed_by: username}).pluck('followed');
            gamelist = await db('games').whereIn('created_by', followed);
        }
        else{
            gamelist = await db('games').orderBy('pool', 'desc').limit(20);
        }  
    }
    else{
        gamelist = await db('games').whereLike('title', `%${title}%`);
    }
   
    res.status(200).send(JSON.stringify(gamelist));
});

router.get('/data', checkAuth, async (req, res) => {
    try{
        const {username, id} = req.query;
        const game = await Game.loadGame(id);
        const bet = await game.getBet(username);

        res.status(200).send(JSON.stringify({
            game: game.data, bet
        }));
    }
    catch(err){
        res.status(500).send(err.message);
    }
    
});

router.get('/by_user/:id', checkAuth, async (req, res) => {
    try{
        const username = req.params.id;
        const gamelist = await db('games').where({created_by: username});
        res.status(200).send(JSON.stringify(gamelist));
    }
    catch(err){
        console.log(err);
    }
});

router.get('/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    const game = await Game.loadGame(id);
    res.status(200).send(JSON.stringify(game));
});

router.post('/', checkAuth, async (req, res) => {
    try{
        const data = req.body;
        data.id = crypto.randomBytes(5).toString('hex');
        data.options = data.type === 'Boolean' ? 'Kyllä;Ei' : data.options;
        data.expiry_date = data.expiry_date == '' ? 'When Closed' : data.expiry_date;

        await db('games').insert(data);

        const username = data.created_by;
        const followers = await db.select('followed_by').from('follow_data').where({followed: username}).pluck('followed_by');

        for(const fol of followers){
            const note = {
                game_title: data.title,
                message: `${username} loi uuden vedon!`,
                username: fol,
            }

            await db('notes').insert(note);
        }
        
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

        const game = await Game.loadGame(id);
        await game.close(side);

        const list = await database.getGamesByUser(req.user.username);
        res.status(200).send(JSON.stringify(list));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;