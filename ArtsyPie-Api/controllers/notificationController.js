const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const notificationsFilePath = join(__dirname, '../data/notifications.json');

const readNotifications = () => {
  try {
    const data = readFileSync(notificationsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeNotifications = (notifications) => {
  writeFileSync(notificationsFilePath, JSON.stringify(notifications, null, 2));
};

function getNotifications(req, res) {
  try {
    const notifications = readNotifications();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}

function createNotification(req, res) {
  try {
    const { type, title, description, userId } = req.body;
    const notifications = readNotifications();
    
    const newNotification = {
      id: Date.now().toString(),
      type,
      title,
      description,
      userId,
      time: '2 m ago',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    
    notifications.unshift(newNotification);
    writeNotifications(notifications);
    
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}

function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const notifications = readNotifications();
    
    const notificationIndex = notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }
    
    notifications[notificationIndex].isRead = true;
    writeNotifications(notifications);
    
    res.json(notifications[notificationIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = {
  getNotifications,
  createNotification,
  markAsRead
};