// API 接口定义
const { get, post, put, del, postQuery, putQuery, delQuery } = require('./request');

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

  // ========== 购物车（后端使用 @RequestParam，需传 Query 参数） ==========
  getCartList: () => get('/cart/list'),
  addToCart: (dishId, shopId, quantity) =>
    postQuery('/cart/add', { dishId, shopId, quantity }),
  updateCartQuantity: (id, quantity) =>
    putQuery('/cart/update', { id, quantity }),
  deleteCartItem: (id) => delQuery('/cart/delete', { id }),
  clearCart: () => del('/cart/clear'),

  // ========== 订单 ==========
  createOrder: (addressId, remark) =>
    post('/api/orders', { addressId, remark }),
  getOrderList: (status) =>
    status !== null && status !== undefined
      ? get('/api/orders', { status })
      : get('/api/orders'),
  getOrderDetail: (id) =>
    get(`/api/orders/${id}`),
  cancelOrder: (id) =>
    put(`/api/orders/${id}/cancel`),
  updateOrderStatus: (id, status) =>
    putQuery(`/api/orders/${id}/status`, { status }),

  // ========== 地址 ==========
  getAddressList: () => get('/address/list'),
  addAddress: (data) => post('/address', data),
  updateAddress: (id, data) => put(`/address/${id}`, data),
  deleteAddress: (id) => del(`/address/${id}`),
  setDefaultAddress: (id) => put(`/address/default/${id}`),

  // ========== 评价（后端使用 @RequestParam） ==========
  addReview: (dishId, orderId, content, rating) =>
    postQuery('/review/add', { dishId, orderId, content, rating }),
  deleteReview: (reviewId) =>
    delQuery('/review/delete', { reviewId }),
  getDishReviews: (dishId) =>
    get('/review/dish', { dishId }),
  getMyReviews: () => get('/review/my'),
  getDishRating: (dishId) =>
    get('/review/rating', { dishId }),
};
