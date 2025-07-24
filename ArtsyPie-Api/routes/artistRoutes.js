const express = require('express');
const router = express.Router();
const ArtistController = require('../controllers/ArtistController');

router.get('/', ArtistController.getAllArtists);
router.get('/:id', ArtistController.getArtistById);

module.exports = router;
