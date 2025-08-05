const express = require('express');
const router = express.Router();
const { getCatalog } = require('../controllers/catalogController');

router.get('/', getCatalog);

module.exports = router;