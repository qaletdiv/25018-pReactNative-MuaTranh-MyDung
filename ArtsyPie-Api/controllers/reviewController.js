const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const reviewsFilePath = join(__dirname, '../data/reviews.json');

const readReviews = () => {
  try {
    const data = readFileSync(reviewsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeReviews = (reviews) => {
  writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2));
};

function createReview(req, res) {
  try {
    const { productId, orderId, rating, review, userId } = req.body;
    const reviews = readReviews();
    
    const newReview = {
      id: Date.now().toString(),
      productId,
      orderId,
      userId,
      rating,
      review,
      createdAt: new Date().toISOString(),
    };
    
    reviews.push(newReview);
    writeReviews(reviews);
    
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}

function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = readReviews();
    const productReviews = reviews.filter(r => r.productId === productId);
    
    res.json(productReviews);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = {
  createReview,
  getProductReviews
};