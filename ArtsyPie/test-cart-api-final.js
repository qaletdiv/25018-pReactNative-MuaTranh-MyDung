// Test file để kiểm tra Cart API endpoints với authentication
const API_BASE_URL = 'http://10.0.2.2:5000/api';

// Helper function để thêm auth header
const getAuthHeaders = () => {
  // Thay YOUR_TOKEN bằng token thực tế của bạn
  const token = 'YOUR_TOKEN'; // hoặc lấy từ localStorage/AsyncStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Test functions
async function testGetCart() {
  console.log('=== Testing GET /api/cart ===');
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testAddToCart(productId = "1", quantity = 2) {
  console.log('=== Testing POST /api/cart ===');
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        productId: productId,
        quantity: quantity
      })
    });
    
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testUpdateCartItem(itemId = "1", quantity = 3) {
  console.log('=== Testing PUT /api/cart/' + itemId + ' ===');
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        quantity: quantity
      })
    });
    
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testRemoveFromCart(itemId = "1") {
  console.log('=== Testing DELETE /api/cart/' + itemId + ' ===');
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testClearCart() {
  console.log('=== Testing DELETE /api/cart ===');
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting Cart API Tests with Authentication...\n');
  
  // Test 1: Get cart
  await testGetCart();
  
  // Test 2: Add to cart
  const addResult = await testAddToCart("1", 2);
  
  // Test 3: Get cart again to see the added item
  await testGetCart();
  
  // Test 4: Update quantity (assuming item ID is "1")
  await testUpdateCartItem("1", 3);
  
  // Test 5: Get cart to see updated quantity
  await testGetCart();
  
  // Test 6: Remove item
  await testRemoveFromCart("1");
  
  // Test 7: Get cart to see empty cart
  await testGetCart();
  
  // Test 8: Add multiple items and then clear cart
  await testAddToCart("1", 1);
  await testAddToCart("2", 2);
  await testGetCart();
  await testClearCart();
  await testGetCart();
  
  console.log('\nAll tests completed!');
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
  window.testCartAPI = {
    testGetCart,
    testAddToCart,
    testUpdateCartItem,
    testRemoveFromCart,
    testClearCart,
    runAllTests
  };
}

// Run tests if this file is executed directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testGetCart,
    testAddToCart,
    testUpdateCartItem,
    testRemoveFromCart,
    testClearCart,
    runAllTests
  };
} 