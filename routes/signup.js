const router = require('express').Router();
const db = require('../models/db.js');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const {username, password1, password2} = req.body;

    const user = await db.getAccount(username);

    if(user){
        res.status(403).send(`User ${username} already exists!`);
    }
    else{
        if(password1 !== password2){
            res.status(403).send('Passwords do not match!');
        }
        else{
            bcrypt.hash(password1, 10, async (err, pass) => {
                if(err){
                    res.status(500).send();
                }

                await db.insertAccount(username, pass);
            });
        }
    }

    res.status(200).send();

});

module.exports = router;