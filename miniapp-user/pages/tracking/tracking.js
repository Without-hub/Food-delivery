const api = require('../../utils/api');
const { showLoading, hideLoading, formatTime } = require('../../utils/util');

Page({
  data: {
    order: null,
    steps: ['已接单', '备餐中', '配送中', '已送达'],
    currentStep: 0,
    rider: { name: '张师傅', phone: '13800001234' }
  },

  onLoad(options) {
    this.orderId = options.orderId;
    this.loadOrder();
  },

  async loadOrder() {
    showLoading();
    try {
      const order = await api.getOrderDetail(this.orderId);
      const stepMap = [0, 1, 1, 2, 3, 3];
      this.setData({ order, currentStep: stepMap[order.status] || 0 });
    } catch (e) { this.mockData(); } finally { hideLoading(); }
  },

  mockData() {
    this.setData({ order: { orderNo: 'DEMO' + Date.now(), createTime: new Date().toISOString(), addressDetail: '模拟地址' } });
  },

  callRider() {
    wx.makePhoneCall({ phoneNumber: this.data.rider.phone });
  }
});
