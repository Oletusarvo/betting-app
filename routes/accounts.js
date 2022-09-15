const router = require('express').Router();
const {Bank} = require('../models/db');
const {checkAuth} = require('../middleware/checkAuth');

router.get('/:username', checkAuth, async (req, res) => {
    const username = req.params.username;
    const account = await new Bank().getAccount(username);
    res.status(200).send(JSON.stringify(account));
});

router.delete('/:username', checkAuth, async (req, res) => {
    const username = req.params.username;
    const {password1, password2} = req.body;

    try{
        if(password1 !== password2){
            throw new Error('Passwords do not match!');
        }
        
        const bank = new Bank();
        await bank.deleteAccount(username);
        res.status(200).send();
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;