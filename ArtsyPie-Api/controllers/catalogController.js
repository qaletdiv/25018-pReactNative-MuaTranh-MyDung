const catalog = require('../data/catalog');

function getCatalog(req, res) {
  try {
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = {
  getCatalog
};