const epxress = require('express');
const router = epxress.Router();

router.get('/', (req, res) => {
    res.send("Welcome to CHAT-APP Server!!!");
})

module.exports = router;