const router = require('express').Router();
const db = require('../dbConfig');
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
                    const defcur = await db('currencies').where({short_name: 'DCE'}).first();
                    const multiplier = Math.pow(10, defcur.precision);
                    
                    await db('accounts').insert({
                        username,
                        password: pass,
                        balance: 100 * multiplier,
                    });
                    
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