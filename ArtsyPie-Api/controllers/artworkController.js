const artworks = require('../data/artworks');

function getAllArtworks(req, res) {
  try {
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}

function getArtworkById(req, res) {
  try {
    const { id } = req.params;
    const artwork = artworks.find(a => a.id === id);
    
    if (!artwork) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json(artwork);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}

function searchArtworks(req, res) {
  try {
    const { query, category, style, priceRange } = req.query;
    let filteredArtworks = [...artworks];
    
    // Filter by search query
    if (query) {
      filteredArtworks = filteredArtworks.filter(art => 
        art.title.toLowerCase().includes(query.toLowerCase()) ||
        art.artist.toLowerCase().includes(query.toLowerCase()) ||
        art.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by category
    if (category) {
      filteredArtworks = filteredArtworks.filter(art => art.type === category);
    }
    
    // Filter by style
    if (style) {
      filteredArtworks = filteredArtworks.filter(art => art.style === style);
    }
    
    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filteredArtworks = filteredArtworks.filter(art => art.price >= min && art.price <= max);
    }
    
    res.json(filteredArtworks);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = {
  getAllArtworks,
  getArtworkById,
  searchArtworks
};