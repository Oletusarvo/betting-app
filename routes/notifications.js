const router = require('express').Router();
const checkAuth = require('../middleware/checkAuth.js').checkAuth;
const db = require('../models/db.js');

router.get('/:username', checkAuth, async (req, res) => {
    const username = req.params.username;

    try{    
        const notifications = await db.getNotifications(username);
        res.status(200).send(JSON.stringify(notifications));
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;