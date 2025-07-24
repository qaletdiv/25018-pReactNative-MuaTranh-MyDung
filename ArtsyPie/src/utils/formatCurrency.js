export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return '0 VNĐ';
  }
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};


