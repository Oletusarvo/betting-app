const router = require('express').Router();
const db = require('../models/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', async (req, res) => {
    const {username, password} = req.body;
    const user = await db.getAccount(username);

    if(user === undefined){
        res.status(404).send(`Account with username ${username} does not exist!`);
        return;
    }

    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign(user, process.env.SERVER_TOKEN_SECRET);

        const payload = {
            token,
            user : {
                username,
                balance : user.balance
            }
        }

        res.status(200).send(JSON.stringify(payload));
    }
    else{
        res.status(403).send();
    }
    
});

module.exports = router;