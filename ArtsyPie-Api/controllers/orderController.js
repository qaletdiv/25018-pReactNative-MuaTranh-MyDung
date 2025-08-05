const fs = require('fs');
const path = require('path');

const orderDataPath = path.join(__dirname, '../data/orders.json');

// Đảm bảo file orders.json tồn tại
function ensureOrderFile() {
  if (!fs.existsSync(orderDataPath)) {
    fs.writeFileSync(orderDataPath, JSON.stringify([], null, 2));
  }
}

// Đọc dữ liệu orders
function readOrderData() {
  ensureOrderFile();
  const data = fs.readFileSync(orderDataPath, 'utf8');
  return JSON.parse(data);
}

// Ghi dữ liệu orders
function writeOrderData(data) {
  ensureOrderFile();
  fs.writeFileSync(orderDataPath, JSON.stringify(data, null, 2));
}

// Lấy tất cả orders
function getAllOrders(req, res) {
  try {
    const orders = readOrderData();
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}

// Lấy order theo ID
function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const orders = readOrderData();
    const order = orders.find(order => order.id === id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}

// Tạo order mới
function createOrder(req, res) {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    const userId = req.user.id;
    
    if (!items || !shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin đơn hàng'
      });
    }
    
    const orders = readOrderData();
    const newOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    writeOrderData(orders);
    
    res.status(201).json({
      success: true,
      message: 'Đơn hàng đã được tạo thành công',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}

// Cập nhật trạng thái order
function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu trạng thái mới'
      });
    }
    
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }
    
    const orders = readOrderData();
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    writeOrderData(orders);
    
    res.json({
      success: true,
      message: 'Trạng thái đơn hàng đã được cập nhật',
      data: orders[orderIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};