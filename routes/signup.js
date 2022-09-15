const router = require('express').Router();
const {Bank} = require('../models/db.js');
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

            const bank = new Bank();
            try{
                await bank.addAccount(username, pass);
            }
            catch(err){
                return res.status(500).send(err.message);
            }
        });
    }
    

    res.status(200).send();

});

module.exports = router;