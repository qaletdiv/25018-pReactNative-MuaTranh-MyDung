const fs = require('fs');
const path = require('path');
const { hashPasswordSHA256 } = require('../utils/hash'); 
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecret123';


const usersFilePath = path.join(__dirname, '../data/users.json');


const readUsers = () => {
  try {
  
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, '[]', 'utf8');
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Lỗi khi đọc file users.json:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};


const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};




exports.register = (req, res) => {
  const { fullName, email, password, confirmPassword, acceptTerms } = req.body;
  const users = readUsers(); 

  if (!acceptTerms)
    return res.status(400).json({ message: 'Bạn phải đồng ý với điều khoản' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Mật khẩu không khớp' });

  const existingUser = users.find(u => u.email === email);
  if (existingUser)
    return res.status(400).json({ message: 'Email đã tồn tại' });

  const passwordHash = hashPasswordSHA256(password);
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, 
    fullName,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users); 

  res.status(201).json({
    message: 'Đăng ký thành công',
    user: { id: newUser.id, fullName, email }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const users = readUsers(); 

  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác' });

  const passwordHash = hashPasswordSHA256(password);
  if (user.passwordHash !== passwordHash)
    return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác' });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    message: 'Đăng nhập thành công',
    token,
    user: { id: user.id, fullName: user.fullName, email: user.email }
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'Email không được đăng ký trong hệ thống.' });
  }
  res.status(200).json({ message: 'Yêu cầu đã được gửi' });
};

exports.resetPassword = (req, res) => {
  const { email, password } = req.body;
  let users = readUsers();
  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Người dùng không tồn tại.' });
  }
  const newPasswordHash = hashPasswordSHA256(password);
  users[userIndex].passwordHash = newPasswordHash;
  writeUsers(users); 
  res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
};