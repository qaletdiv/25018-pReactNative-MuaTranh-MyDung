import axiosClient from './axiosClient';

const cartApi = {
  // Get user's cart
  getCart: () => {
    return axiosClient.get('/cart');
  },

  // Add item to cart with full product details and options
  addToCart: (productData) => {
    //console.log('cartApi.addToCart - URL:', 'http://10.0.2.2:5000/api/cart');
    console.log('cartApi.addToCart - Request body:', JSON.stringify({
      productId: productData.productId,
      quantity: productData.quantity || 1,
      product: productData.product,
      selectedOptions: productData.selectedOptions || {
        size: 'Standard',
        frame: 'No Frame'
      }
    }, null, 2));
    
    return axiosClient.post('/cart', {
      productId: productData.productId,
      quantity: productData.quantity || 1,
      product: productData.product,
      selectedOptions: productData.selectedOptions || {
        size: 'Standard',
        frame: 'No Frame'
      }
    });
  },

  // Update cart item quantity
  updateCartItem: (productId, quantity, selectedOptions) => {
    return axiosClient.put(`/cart/${productId}`, {
      quantity,
      selectedOptions: selectedOptions || {
        size: 'Standard',
        frame: 'No Frame'
      }
    });
  },

  // Remove item from cart - Cách 1: Theo productId + selectedOptions
  removeFromCart: (productId, selectedOptions) => {
    return axiosClient.delete(`/cart/${productId}`, {
      data: { selectedOptions }
    });
  },

  // Remove item from cart - Cách 2: Theo index 
  removeCartItemByIndex: async (index, cartItems) => {
    try {
      // Thử endpoint mới trước
      return await axiosClient.delete(`/cart/item/${index}`);
    } catch (error) {
      //console.log('Endpoint mới /cart/item/{index} không hoạt động, fallback về endpoint cũ');
      
      if (cartItems && cartItems[index]) {
        const item = cartItems[index];
        return axiosClient.delete(`/cart/${item.productId}`, {
          data: { selectedOptions: item.selectedOptions }
        });
      } else {
        throw new Error('Không thể xác định item để xóa');
      }
    }
  },

  // Clear entire cart
  clearCart: () => {
    return axiosClient.delete('/cart');
  }
};

export default cartApi; 