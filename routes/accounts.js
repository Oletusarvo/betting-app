const router = require('express').Router();
const db = require('../models/db');
const {checkAuth} = require('../middleware/checkAuth');

router.get('/:username', checkAuth, async (req, res) => {
    const username = req.params.username;
    const account = await db.getAccount(username);
    res.status(200).send(JSON.stringify(account));
});

module.exports = router;