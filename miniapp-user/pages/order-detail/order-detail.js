const api = require('../../utils/api');
const { showLoading, hideLoading, formatPrice, formatTime, getOrderStatusText, getOrderStatusClass } = require('../../utils/util');

Page({
  data: { order: null, reviewContent: '', reviewRating: 5, showReviewModal: false },

  onLoad(options) { this.orderId = options.id; this.loadOrder(); },

  async loadOrder() {
    showLoading();
    try {
      const order = await api.getOrderDetail(this.orderId);
      this.setData({ order });
    } catch (e) {} finally { hideLoading(); }
  },

  async cancelOrder() {
    wx.showModal({ title: '提示', content: '确定取消订单吗？', success: async (res) => {
      if (res.confirm) { await api.cancelOrder(this.orderId); this.loadOrder(); }
    }});
  },

  onRatingTap(e) { this.setData({ reviewRating: e.currentTarget.dataset.rating }); },
  onReviewInput(e) { this.setData({ reviewContent: e.detail.value }); },

  async submitReview() {
    const order = this.data.order;
    if (!order?.items?.length) return;
    try {
      for (const item of order.items) {
        await api.addReview(item.dishId, order.id, this.data.reviewContent, this.data.reviewRating);
      }
      wx.showToast({ title: '评价成功', icon: 'success' });
      this.setData({ showReviewModal: false });
      this.loadOrder();
    } catch (e) {}
  },

  showReview() { this.setData({ showReviewModal: true, reviewContent: '', reviewRating: 5 }); },
  hideReviewModal() { this.setData({ showReviewModal: false }); },

  goTracking() { wx.navigateTo({ url: `/pages/tracking/tracking?orderId=${this.orderId}` }); },

  formatPrice, formatTime, getOrderStatusText, getOrderStatusClass
});
