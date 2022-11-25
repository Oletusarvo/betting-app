const router = require('express').Router();
const db = require('../dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', async (req, res) => {
    const {username, password} = req.body;
    const user = await db('users').where({username}).first();

    if(user === undefined){
        res.status(404).send(`Account with username ${username} does not exist!`);
        return;
    }

    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign(user, process.env.SERVER_TOKEN_SECRET);
        const accounts = await db('accounts').where({username});

        //Include the currency symbol for each account, if it exists.
        for(const acc of accounts){
            const currency = await db.select('name', 'short_name', 'symbol', 'precision').from('currencies').where({short_name: acc.currency}).first();
            acc.currency = currency;
            console.log(acc.currency);
        }

        const payload = {
            token,
            user : {
                username,
                accounts
            }
        }
        res.status(200).send(JSON.stringify(payload));
    }
    else{
        res.status(403).send('Incorrect password!');
    }
    
});

module.exports = router;