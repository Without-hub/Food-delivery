const api = require('../../utils/api');
const { showLoading, hideLoading } = require('../../utils/util');

Page({
  data: {
    banners: ['../../images/tab-home-active.png', '../../images/tab-order-active.png', '../../images/tab-cart-active.png'],
    categories: [],
    shops: [],
    keyword: '',
    activeCategoryId: null,
    pageNum: 1,
    hasMore: true,
    cartCount: 0
  },

  onLoad() {
    this.loadCategories();
    this.loadShops();
  },

  onShow() {
    this.loadCartCount();
  },

  async loadCategories() {
    try {
      const cats = await api.getDishCategory(0);
      // 固定8个分类
      const defaultCats = [
        { id: null, name: '全部', icon: '🔥' },
        { id: 1, name: '汉堡' }, { id: 2, name: '茶饮' }, { id: 3, name: '炸鸡' },
        { id: 4, name: '快餐' }, { id: 5, name: '小吃' }, { id: 6, name: '日料' },
        { id: 7, name: '中餐' }, { id: 8, name: '甜品' }
      ];
      this.setData({ categories: defaultCats });
    } catch (e) {
      this.setData({ categories: [] });
    }
  },

  async loadShops(refresh = false) {
    if (!this.data.hasMore && !refresh) return;
    showLoading();
    try {
      const pageNum = refresh ? 1 : this.data.pageNum;
      const res = await api.getShopList(pageNum);
      const list = res.list || res.records || res || [];
      this.setData({
        shops: refresh ? list : [...this.data.shops, ...list],
        pageNum: pageNum + 1,
        hasMore: list.length >= 10
      });
    } catch (e) {} finally { hideLoading(); }
  },

  async loadCartCount() {
    try {
      const app = getApp();
      if (!app.globalData.token) return;
      const list = await api.getCartList();
      const count = list.reduce((s, i) => s + (i.quantity || 0), 0);
      this.setData({ cartCount: count });
      app.globalData.cartCount = count;
    } catch (e) {}
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
    this.searchDebounce();
  },

  searchDebounce: (function() {
    let timer;
    return function() {
      clearTimeout(timer);
      const self = this;
      timer = setTimeout(() => {
        self.setData({ shops: [], pageNum: 1, hasMore: true });
        self.loadShops(true);
      }, 400);
    };
  })(),

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeCategoryId: id === this.data.activeCategoryId ? null : id, shops: [], pageNum: 1, hasMore: true });
    this.loadShops(true);
  },

  onShopTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/shop/shop?shopId=${id}` });
  },

  onReachBottom() { this.loadShops(); },

  goCart() { wx.switchTab({ url: '/pages/cart/cart' }); }
});
