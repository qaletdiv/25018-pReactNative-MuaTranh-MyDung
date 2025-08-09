// Test file để kiểm tra Banner API
// Sử dụng 10.0.2.2 cho máy ảo Android, localhost cho web
const API_BASE_URL = 'http://10.0.2.2:5000/api';

async function testGetBanners() {
  console.log('=== Testing GET /api/home/banner ===');
  try {
    const response = await fetch(`${API_BASE_URL}/home/banner`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test function
async function runBannerTest() {
  console.log('Starting Banner API Test...\n');
  await testGetBanners();
  console.log('\nBanner test completed!');
}

// Export for use
if (typeof window !== 'undefined') {
  window.testBannerAPI = {
    testGetBanners,
    runBannerTest
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testGetBanners,
    runBannerTest
  };
} 