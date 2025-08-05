const fs = require('fs');
const path = require('path');

const loadAddressData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/addresses.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const saveAddressData = (data) => {
  fs.writeFileSync(path.join(__dirname, '../data/addresses.json'), JSON.stringify(data, null, 2));
};

exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressData = loadAddressData();
    const userAddresses = addressData[userId] || [];
    
    res.json({
      success: true,
      addresses: userAddresses
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, district, city, isDefault = false } = req.body;
    
    const addressData = loadAddressData();
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
    
    
    if (isDefault) {
      addressData[userId].forEach(addr => addr.isDefault = false);
    }
    
    addressData[userId].push(newAddress);
    saveAddressData(addressData);
    
    res.status(201).json({
      success: true,
      message: 'Đã thêm địa chỉ mới',
      address: newAddress
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, phone, address, district, city, isDefault = false } = req.body;
    
    const addressData = loadAddressData();
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
    
    saveAddressData(addressData);
    
    res.json({
      success: true,
      message: 'Đã cập nhật địa chỉ',
      address: addressData[userId][addressIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const addressData = loadAddressData();
    if (!addressData[userId]) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    
    addressData[userId] = addressData[userId].filter(addr => addr.id !== id);
    saveAddressData(addressData);
    
    res.json({
      success: true,
      message: 'Đã xóa địa chỉ'
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 