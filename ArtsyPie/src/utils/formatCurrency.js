export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return '$0.00';
  }
  
  // Convert VND to USD (1 USD = 25000 VND)
  const usdAmount = amount / 25000;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount);
};


