const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const artworkRoutes = require('./routes/artworkRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//routes
app.use('/api/cart', require('./routes/cart'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/artworks', artworkRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/images', express.static('assets/Images'));

app.get('/', (req, res) => res.send('API đang chạy'));

app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
