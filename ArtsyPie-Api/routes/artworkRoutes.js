const express = require('express');
const router = express.Router();
const { getAllArtworks, searchArtworks, getArtworkById } = require('../controllers/artworkController');

router.get('/', getAllArtworks);
router.get('/search', searchArtworks);
router.get('/:id', getArtworkById);

module.exports = router;