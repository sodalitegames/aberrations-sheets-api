const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).render('index', { title: 'Aberrations RPG Sheets API', mode: process.env.NODE_ENV });
});

module.exports = router;
