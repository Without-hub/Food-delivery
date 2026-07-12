// API 接口定义
const { get, post, put, del } = require('./request');

module.exports = {

  // ========== 用户认证 ==========
  login: (data) => post('/user/login', data),
  register: (data) => post('/user/register', data),
  getUserInfo: () => get('/user/info'),
  updateUserInfo: (data) => put('/user/info', data),

  // ========== 商家 ==========
  getShopList: (pageNum = 1, pageSize = 10) =>
    get('/api/shop/list', { pageNum, pageSize }),
  getShopDetail: (shopId) =>
    get('/api/shop/detail', { shopId }),
  filterShopsByCategory: (categoryId, pageNum = 1, pageSize = 10) =>
    get('/api/shop/filter/category', { categoryId, pageNum, pageSize }),

  // ========== 菜品 ==========
  getDishCategory: (shopId) =>
    get('/api/dish/category/list', { shopId }),
  getDishList: (shopId, keyword, pageNum = 1, pageSize = 100) =>
    get('/api/dish/list', { shopId, keyword, pageNum, pageSize }),
  getDishDetail: (dishId) =>
    get('/api/dish/detail', { dishId }),

  // ========== 购物车 ==========
  getCartList: () => get('/cart/list'),
  addToCart: (dishId, shopId, quantity) =>
    post('/cart/add', { dishId, shopId, quantity }),
  updateCartQuantity: (id, quantity) =>
    put('/cart/update', { id, quantity }),
  deleteCartItem: (id) => del('/cart/delete', { id }),
  clearCart: () => del('/cart/clear'),

  // ========== 订单 ==========
  createOrder: (addressId, remark) =>
    post('/api/orders', { addressId, remark }),
  getOrderList: (status) =>
    get('/api/orders', { status }),
  getOrderDetail: (id) =>
    get(`/api/orders/${id}`),
  cancelOrder: (id) =>
    put(`/api/orders/${id}/cancel`),
  updateOrderStatus: (id, status) =>
    put(`/api/orders/${id}/status`, { status }),

  // ========== 地址 ==========
  getAddressList: () => get('/address/list'),
  addAddress: (data) => post('/address', data),
  updateAddress: (id, data) => put(`/address/${id}`, data),
  deleteAddress: (id) => del(`/address/${id}`),
  setDefaultAddress: (id) => put(`/address/default/${id}`),

  // ========== 评价 ==========
  addReview: (dishId, orderId, content, rating) =>
    post('/review/add', { dishId, orderId, content, rating }),
  deleteReview: (reviewId) =>
    del('/review/delete', { reviewId }),
  getDishReviews: (dishId) =>
    get('/review/dish', { dishId }),
  getMyReviews: () => get('/review/my'),
  getDishRating: (dishId) =>
    get('/review/rating', { dishId }),
};
