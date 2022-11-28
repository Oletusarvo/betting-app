const router = require('express').Router();
const db = require('../dbConfig');
const bcrypt = require('bcrypt');
const currency = require('../currencyfile');

router.post('/', async (req, res) => {
    const {username, password1, password2} = req.body;
    if(password1 !== password2){
        return res.status(403).send('Salasanat eivät täsmää!');
    }
    else{
        bcrypt.hash(password1, 15, async (err, pass) => {
            if(err){
                return res.status(500).send(err.message);
            }
            else{
                try{
                    await db('users').insert({
                        username,
                        password: pass,
                    });

                    await db('accounts').insert({
                        username,
                        currency: 'DCE',
                        balance: currency.defaultIssueAmount,
                    });
                    
                    return res.status(200).send();
                }
                catch(err){
                    return res.status(500).send(`Käyttäjätili ${username} on jo olemassa!`);
                }
            }
        });
    }
});

module.exports = router;