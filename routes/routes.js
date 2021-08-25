const express = require('express');

// import controller

const router = express.Router();

router.route('/').get((req, res) => res.send('Hello there'));

module.exports = router;
