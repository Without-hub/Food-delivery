const api = require('../../utils/api');
const { showLoading, hideLoading, formatPrice } = require('../../utils/util');

Page({
  data: {
    shop: {},
    categories: [],
    dishes: [],
    activeCategoryId: null,
    cartItems: [],
    cartTotal: 0,
    cartCount: 0,
    showCartPopup: false
  },

  onLoad(options) {
    this.shopId = options.shopId;
    this.loadData();
  },

  async loadData() {
    showLoading();
    try {
      const [shop, categories] = await Promise.all([
        api.getShopDetail(this.shopId),
        api.getDishCategory(this.shopId)
      ]);
      this.setData({ shop, categories, activeCategoryId: categories.length > 0 ? categories[0].id : null });
      if (categories.length > 0) this.loadDishes(categories[0].id);
    } catch (e) {} finally { hideLoading(); }
  },

  async loadDishes(categoryId) {
    try {
      const dishes = await api.getDishList(this.shopId, '', 1, 100);
      const filtered = categoryId ? (dishes.list || dishes || []).filter(d => d.categoryId === categoryId) : (dishes.list || dishes || []);
      this.setData({ dishes: filtered || [] });
    } catch (e) { this.setData({ dishes: [] }); }
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeCategoryId: id });
    this.loadDishes(id);
  },

  async addToCart(e) {
    const dishId = e.currentTarget.dataset.id;
    const app = getApp();
    if (!app.checkLogin()) { app.requireLogin(); return; }
    try {
      await api.addToCart(dishId, this.shopId, 1);
      this.updateCartInfo();
      wx.showToast({ title: '已加入购物车', icon: 'success', duration: 800 });
    } catch (e) {}
  },

  async updateCartInfo() {
    try {
      const items = await api.getCartList();
      const total = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
      const count = items.reduce((s, i) => s + (i.quantity || 0), 0);
      this.setData({ cartItems: items, cartTotal: total, cartCount: count });
    } catch (e) {}
  },

  toggleCart() { this.setData({ showCartPopup: !this.data.showCartPopup }); },

  async updateQty(e) {
    const { id, delta } = e.currentTarget.dataset;
    const item = this.data.cartItems.find(i => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) { await api.deleteCartItem(id); }
    else { await api.updateCartQuantity(id, newQty); }
    this.updateCartInfo();
  },

  goOrder() {
    if (this.data.cartCount === 0) { wx.showToast({ title: '购物车为空', icon: 'none' }); return; }
    wx.navigateTo({ url: '/pages/order/order' });
  },

  formatPrice
});
