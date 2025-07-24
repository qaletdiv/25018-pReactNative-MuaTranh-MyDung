const express = require('express');
const router = express.Router();
const ArtController = require('../controllers/ArtController');

router.get('/', ArtController.getAllArts);
router.get('/:id', ArtController.getArtById);

module.exports = router;
