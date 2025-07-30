const fs = require('fs');
const path = require('path');

const favoritesFilePath = path.join(__dirname, '../data/favorites.json');

const readFavorites = () => {
  try {
    if (!fs.existsSync(favoritesFilePath)) {
      fs.writeFileSync(favoritesFilePath, '{}', 'utf8');
    }
    const data = fs.readFileSync(favoritesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Lỗi khi đọc file favorites.json:", error);
    return {};
  }
};

const writeFavorites = (favorites) => {
  fs.writeFileSync(favoritesFilePath, JSON.stringify(favorites, null, 2), 'utf8');
};

exports.addToFavorites = (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  
  const favorites = readFavorites();
  
  if (!favorites[userId]) {
    favorites[userId] = [];
  }
  
  if (!favorites[userId].includes(productId)) {
    favorites[userId].push(productId);
    writeFavorites(favorites);
  }
  
  res.status(200).json({ 
    message: 'Đã thêm vào yêu thích',
    favorites: favorites[userId]
  });
};

exports.removeFromFavorites = (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  
  const favorites = readFavorites();
  
  if (favorites[userId]) {
    favorites[userId] = favorites[userId].filter(id => id !== productId);
    writeFavorites(favorites);
  }
  
  res.status(200).json({ 
    message: 'Đã xóa khỏi yêu thích',
    favorites: favorites[userId] || []
  });
};

exports.getFavorites = (req, res) => {
  const userId = req.user.id;
  const favorites = readFavorites();
  
  res.status(200).json({ 
    favorites: favorites[userId] || []
  });
}; 