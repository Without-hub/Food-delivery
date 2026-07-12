const api = require('../../utils/api');
const { showLoading, hideLoading, formatPrice, formatTime, getOrderStatusText, getOrderStatusClass } = require('../../utils/util');

Page({
  data: { tabs: ['全部', '待支付', '已支付', '配送中', '已完成', '已取消'], activeTab: 0, orders: [] },

  onLoad() { this.loadOrders(); },
  onShow() { this.loadOrders(); },

  async loadOrders() {
    showLoading();
    try {
      const statusMap = [null, 0, 1, 2, 3, 4];
      const status = statusMap[this.data.activeTab];
      const orders = await api.getOrderList(status);
      this.setData({ orders: orders || [] });
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

  formatPrice, formatTime, getOrderStatusText, getOrderStatusClass
});
