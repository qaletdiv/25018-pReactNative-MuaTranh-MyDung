const crypto = require('crypto');

function hashPasswordSHA256(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = { hashPasswordSHA256 };
