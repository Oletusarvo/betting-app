const router = require('express').Router();
const {Bank} = require('../models/db');
const dotenv = require('dotenv').config();
const {checkAuth} = require('../middleware/checkAuth.js');

router.post('/', checkAuth, async (req, res) => {
    const n = Math.floor(Math.random() * 0xff) ^ (new Date().getTime() & 0xff) ^ parseInt(process.env.SERVER_COIN_SECRET, 16);
    const reward = 10000;
    const {guess} = req.body;

    if(guess == n){
        const bank = new Bank();
        await bank.deposit(reward);

        res.status(200).send(reward.toString());
    }
    else{
        res.status(200).send('0');
    }
});

module.exports = router;