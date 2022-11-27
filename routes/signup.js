const router = require('express').Router();
const db = require('../dbConfig');
const bcrypt = require('bcrypt');

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
                        balance: 10000,
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