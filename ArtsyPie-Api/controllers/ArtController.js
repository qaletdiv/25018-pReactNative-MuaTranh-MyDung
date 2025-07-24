const arts = require('../data/arts');

exports.getAllArts = (req, res) => {
  res.json(arts);
};

exports.getArtById = (req, res) => {
  const art = arts.find((a) => a.id === req.params.id);
  if (art) {
    res.json(art);
  } else {
    res.status(404).json({ message: 'Art not found' });
  }
};
