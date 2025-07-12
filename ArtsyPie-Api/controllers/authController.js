const { users } = require('../data/users');
const { hashPasswordSHA256 } = require('../utils/hash');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecret123';

exports.register = (req, res) => {
  const { fullName, email, password, confirmPassword, acceptTerms } = req.body;

  if (!acceptTerms)
    return res.status(400).json({ message: 'Bạn phải đồng ý với điều khoản' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Mật khẩu không khớp' });

  const existingUser = users.find(u => u.email === email);
  if (existingUser)
    return res.status(400).json({ message: 'Email đã tồn tại' });

  const passwordHash = hashPasswordSHA256(password);
  const newUser = {
    id: users.length + 1,
    fullName,
    email,
    passwordHash,
    createdAt: new Date()
  };

  users.push(newUser);

  res.status(201).json({
    message: 'Đăng ký thành công',
    user: { id: newUser.id, fullName, email }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(400).json({ message: 'Email không tồn tại' });

  const passwordHash = hashPasswordSHA256(password);
  if (user.passwordHash !== passwordHash)
    return res.status(400).json({ message: 'Sai mật khẩu' });

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
