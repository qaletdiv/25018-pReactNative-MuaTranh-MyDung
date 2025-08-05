// Test Cart API theo documentation
const API_BASE_URL = 'http://10.0.2.2:5000/api';

// Token thực tế từ logs
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJsZW5nb2NteWR1bmdnMTM5QGdtYWlsLmNvbSIsImlhdCI6MTc1NDMxNDY5OCwiZXhwIjoxNzU0NDAxMDk4fQ.8w1Avm9uFs2p7zAWTBdwJfw74AYuTKiiAnEAyoF8fxU';

async function testCartAPI() {
  console.log('=== Testing Cart API theo Documentation ===\n');
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  };

  try {
    // Test 1: GET /cart (lấy giỏ hàng)
    console.log('1. Testing GET /cart');
    const response1 = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers
    });
    const data1 = await response1.json();
    console.log('Response:', data1);
    console.log('Status:', response1.status);
    console.log('Expected format: { success: true, cart: { items: [], total: 0 } }');
    console.log('');

    // Test 2: POST /cart (thêm sản phẩm)
    console.log('2. Testing POST /cart');
    const response2 = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        productId: "3",
        quantity: 1
      })
    });
    const data2 = await response2.json();
    console.log('Response:', data2);
    console.log('Status:', response2.status);
    console.log('');

    // Test 3: GET /cart (kiểm tra sau khi thêm)
    console.log('3. Testing GET /cart (sau khi thêm)');
    const response3 = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers
    });
    const data3 = await response3.json();
    console.log('Response:', data3);
    console.log('Status:', response3.status);
    console.log('');

    // Test 4: PUT /cart/3 (cập nhật số lượng)
    console.log('4. Testing PUT /cart/3');
    const response4 = await fetch(`${API_BASE_URL}/cart/3`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        quantity: 2
      })
    });
    const data4 = await response4.json();
    console.log('Response:', data4);
    console.log('Status:', response4.status);
    console.log('');

    // Test 5: DELETE /cart/3 (xóa sản phẩm)
    console.log('5. Testing DELETE /cart/3');
    const response5 = await fetch(`${API_BASE_URL}/cart/3`, {
      method: 'DELETE',
      headers
    });
    const data5 = await response5.json();
    console.log('Response:', data5);
    console.log('Status:', response5.status);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Chạy test
testCartAPI(); 