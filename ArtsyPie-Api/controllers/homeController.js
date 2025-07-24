const banners = require('../data/banners');

exports.getBanners = (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}`;

  const formattedBanners = banners.map((item) => ({
    ...item,
    image: `${fullUrl}${item.image}`, 
  }));

  res.json({ banners: formattedBanners });
};
