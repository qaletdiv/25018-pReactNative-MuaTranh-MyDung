const artists = require('../data/artists');

exports.getAllArtists = (req, res) => {
  res.json(artists);
};

exports.getArtistById = (req, res) => {
  const artist = artists.find((a) => a.id === req.params.id);
  if (artist) {
    res.json(artist);
  } else {
    res.status(404).json({ message: 'Artist not found' });
  }
};
