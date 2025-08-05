const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Address API is working!' });
});

// GET /api/addresses - Lấy danh sách địa chỉ
router.get('/', (req, res) => {
  try {
    //  user ID
    const userId = 'user123';
    
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, '../data/addresses.json');
    
    let addressData = {};
    try {
      addressData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (error) {
      addressData = {};
    }
    
    const userAddresses = addressData[userId] || [];
    
    res.json({
      success: true,
      addresses: userAddresses
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// POST /api/addresses - Thêm địa chỉ mới
router.post('/', (req, res) => {
  try {
    // Mock user ID
    const userId = 'user123';
    const { name, phone, address, district, city, isDefault = false } = req.body;
    
    // Validate dữ liệu
    if (!name || !phone || !address || !district || !city) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, '../data/addresses.json');
    
    let addressData = {};
    try {
      addressData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (error) {
      addressData = {};
    }
    
    if (!addressData[userId]) {
      addressData[userId] = [];
    }
    
    const newAddress = {
      id: Date.now().toString(),
      name,
      phone,
      address,
      district,
      city,
      isDefault
    };
    
    // Nếu đặt làm mặc định, bỏ mặc định của địa chỉ khác
    if (isDefault) {
      addressData[userId].forEach(addr => addr.isDefault = false);
    }
    
    addressData[userId].push(newAddress);
    fs.writeFileSync(dataPath, JSON.stringify(addressData, null, 2));
    
    res.status(201).json({
      success: true,
      message: 'Địa chỉ đã được thêm thành công',
      address: newAddress
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// PUT /api/addresses/:id - Cập nhật địa chỉ
router.put('/:id', (req, res) => {
  try {
    // Mock user ID
    const userId = 'user123';
    const { id } = req.params;
    const { name, phone, address, district, city, isDefault = false } = req.body;
    
    // Validate dữ liệu
    if (!name || !phone || !address || !district || !city) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, '../data/addresses.json');
    
    let addressData = {};
    try {
      addressData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (error) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    
    if (!addressData[userId]) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    
    const addressIndex = addressData[userId].findIndex(addr => addr.id === id);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    
    // Nếu đặt làm mặc định, bỏ mặc định của địa chỉ khác
    if (isDefault) {
      addressData[userId].forEach(addr => addr.isDefault = false);
    }
    
    addressData[userId][addressIndex] = {
      ...addressData[userId][addressIndex],
      name,
      phone,
      address,
      district,
      city,
      isDefault
    };
    
    fs.writeFileSync(dataPath, JSON.stringify(addressData, null, 2));
    
    res.json({
      success: true,
      message: 'Địa chỉ đã được cập nhật thành công',
      address: addressData[userId][addressIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// DELETE /api/addresses/:id - Xóa địa chỉ
router.delete('/:id', (req, res) => {
  try {
    // Mock user ID
    const userId = 'user123';
    const { id } = req.params;
    
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, '../data/addresses.json');
    
    let addressData = {};
    try {
      addressData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (error) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    
    if (!addressData[userId]) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    
    const addressIndex = addressData[userId].findIndex(addr => addr.id === id);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    
    addressData[userId].splice(addressIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(addressData, null, 2));
    
    res.json({
      success: true,
      message: 'Địa chỉ đã được xóa thành công'
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router; 