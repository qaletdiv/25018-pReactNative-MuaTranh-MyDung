const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/homeController');


router.get('/banner', HomeController.getBanners);

module.exports = router;
