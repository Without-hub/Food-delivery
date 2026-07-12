const api = require('../../utils/api');
const { showLoading, hideLoading, formatPrice } = require('../../utils/util');

Page({
  data: { cartItems: [], totalPrice: 0, allChecked: true, loading: false },

  onShow() { this.loadCart(); },

  async loadCart() {
    showLoading();
    try {
      const items = await api.getCartList();
      const total = items.reduce((s, i) => s + (i.subtotal || i.price * i.quantity || 0), 0);
      this.setData({ cartItems: items || [], totalPrice: total });
    } catch (e) {} finally { hideLoading(); }
  },

  async onQtyChange(e) {
    const { id, delta } = e.currentTarget.dataset;
    const item = this.data.cartItems.find(i => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) { await api.deleteCartItem(id); }
    else { await api.updateCartQuantity(id, newQty); }
    this.loadCart();
  },

  async clearCart() {
    wx.showModal({ title: '提示', content: '确定要清空购物车吗？', success: async (res) => {
      if (res.confirm) { await api.clearCart(); this.loadCart(); }
    }});
  },

  goOrder() {
    if (this.data.cartItems.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' }); return;
    }
    wx.navigateTo({ url: '/pages/order/order' });
  },

  formatPrice
});
