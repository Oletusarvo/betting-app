const router = require('express').Router();
const db = require('../models/db.js');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const {username, password1, password2} = req.body;
    if(password1 !== password2){
        return res.status(403).send('Passwords do not match!');
    }
    else{
        bcrypt.hash(password1, 15, async (err, pass) => {
            if(err){
                return res.status(500).send(err.message);
            }
            else{
                try{
                    await db.addAccount(username, pass);
                    return res.status(200).send();
                }
                catch(err){
                    return res.status(500).send(`Account with username ${username} already exists!`);
                }
            }
        });
    }
});

module.exports = router;