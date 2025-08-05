const fs = require('fs');
const path = require('path');

// Load data
const loadFavoritesData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/favorites.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const saveFavoritesData = (data) => {
  fs.writeFileSync(path.join(__dirname, '../data/favorites.json'), JSON.stringify(data, null, 2));
};

const loadArtworksData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/artworks.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Controllers
exports.addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    
    const favoritesData = loadFavoritesData();
    const artworks = loadArtworksData();
    
    const product = artworks.find(item => item.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    if (!favoritesData[userId]) {
      favoritesData[userId] = [];
    }
    
    const exists = favoritesData[userId].find(item => item.id === productId);
    if (exists) {
      return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
    }
    
    favoritesData[userId].push({
      id: product.id,
      title: product.title,
      artist: product.artist,
      price: product.price,
      image: product.image,
      tag: product.tag,
      tagColor: product.tagColor
    });
    
    saveFavoritesData(favoritesData);
    
    res.json({
      success: true,
      message: 'Đã thêm vào danh sách yêu thích',
      favorites: favoritesData[userId]
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    
    const favoritesData = loadFavoritesData();
    
    if (!favoritesData[userId]) {
      return res.status(404).json({ message: 'Danh sách yêu thích không tồn tại' });
    }
    
    favoritesData[userId] = favoritesData[userId].filter(item => item.id !== productId);
    
    saveFavoritesData(favoritesData);
    
    res.json({
      success: true,
      message: 'Đã xóa khỏi danh sách yêu thích',
      favorites: favoritesData[userId]
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favoritesData = loadFavoritesData();
    
    const userFavorites = favoritesData[userId] || [];
    
    res.json({
      success: true,
      favorites: userFavorites
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    
    const favoritesData = loadFavoritesData();
    
    if (!favoritesData[userId]) {
      return res.json({
        success: true,
        isFavorite: false
      });
    }
    
    const isFavorite = favoritesData[userId].some(item => item.id === productId);
    
    res.json({
      success: true,
      isFavorite
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};