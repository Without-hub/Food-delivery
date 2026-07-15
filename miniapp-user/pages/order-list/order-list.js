const api = require('../../utils/api');
const util = require('../../utils/util');
const { showLoading, hideLoading, formatPrice, formatTime, getOrderStatusText, getOrderStatusClass, imgUrl } = util;

Page({
  data: { tabs: ['全部', '待支付', '已支付', '配送中', '已完成', '已取消'], activeTab: 0, orders: [] },

  onLoad() { this.loadOrders(); },
  onShow() { this.loadOrders(); },

  async loadOrders() {
    const app = getApp();
    if (!app.checkLogin()) { return; }
    showLoading();
    try {
      const statusMap = [null, 0, 1, 2, 3, 4];
      const status = statusMap[this.data.activeTab];
      const orders = await api.getOrderList(status);
      // 预处理：给每个订单加上 displayItems（安全切片）
      const processed = (orders || []).map(o => ({
        ...o,
        displayItems: (o.items || []).slice(0, 4)
      }));
      this.setData({ orders: processed });
    } catch (e) {} finally { hideLoading(); }
  },

  onTabTap(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
    this.loadOrders();
  },

  goDetail(e) { wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${e.currentTarget.dataset.id}` }); },

  async cancelOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({ title: '提示', content: '确定取消订单吗？', success: async (res) => {
      if (res.confirm) { await api.cancelOrder(id); this.loadOrders(); }
    }});
  },

  goReview(e) {
    const order = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${order.id}`
    });
  },

  goTracking(e) { wx.navigateTo({ url: `/pages/tracking/tracking?orderId=${e.currentTarget.dataset.id}` }); },

  imgUrl, formatPrice, formatTime, getOrderStatusText, getOrderStatusClass
});
