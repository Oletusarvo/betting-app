const router = require('express').Router();
const {Bank} = require('../models/db');
const {checkAuth} = require('../middleware/checkAuth');

router.get('/:username', checkAuth, async (req, res) => {
    const username = req.params.username;
    const account = await new Bank().getAccount(username);
    res.status(200).send(JSON.stringify(account));
});

module.exports = router;