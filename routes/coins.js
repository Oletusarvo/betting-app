const router = require('express').Router();
const db = require('../models/db');
const dotenv = require('dotenv').config();
const {checkAuth} = require('../middleware/checkAuth.js');

router.post('/', checkAuth, async (req, res) => {
    const n = Math.floor(Math.random() * 0xff) ^ (new Date().getTime() & 0xff) ^ parseInt(process.env.SERVER_COIN_SECRET, 16);
    const reward = 10000;
    const {guess} = req.body;
    console.log(n);

    if(guess == n){
        const acc = await db.getAccount(req.user.username);
        acc.balance += reward;
        await db.updateAccount(req.user.username, acc.balance);

        res.status(200).send(reward.toString());
    }
    else{
        res.status(200).send('0');
    }
});

module.exports = router;