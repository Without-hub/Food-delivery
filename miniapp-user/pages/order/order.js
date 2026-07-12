const api = require('../../utils/api');
const { showLoading, hideLoading, formatPrice } = require('../../utils/util');

Page({
  data: {
    addressList: [], selectedAddrId: null, selectedAddr: null,
    cartItems: [], totalPrice: 0, deliveryFee: 0, remark: '', submitting: false
  },

  onShow() { this.loadData(); },

  async loadData() {
    showLoading();
    try {
      const [addressList, cartItems] = await Promise.all([api.getAddressList(), api.getCartList()]);
      const defaultAddr = addressList.find(a => a.isDefault) || addressList[0];
      const total = cartItems.reduce((s, i) => s + (i.subtotal || i.price * i.quantity || 0), 0);
      this.setData({ addressList: addressList || [], selectedAddr: defaultAddr, selectedAddrId: defaultAddr?.id, cartItems: cartItems || [], totalPrice: total });
    } catch (e) {} finally { hideLoading(); }
  },

  selectAddress(e) {
    const id = e.currentTarget.dataset.id;
    const addr = this.data.addressList.find(a => a.id === id);
    this.setData({ selectedAddrId: id, selectedAddr: addr });
  },

  onRemarkInput(e) { this.setData({ remark: e.detail.value }); },

  addAddress() { wx.navigateTo({ url: '/pages/address-add/address-add' }); },

  async submitOrder() {
    if (!this.data.selectedAddr) { wx.showToast({ title: '请选择收货地址', icon: 'none' }); return; }
    if (this.data.submitting) return;
    this.setData({ submitting: true });
    try {
      const order = await api.createOrder(this.data.selectedAddrId, this.data.remark);
      wx.showToast({ title: '下单成功', icon: 'success' });
      setTimeout(() => wx.redirectTo({ url: `/pages/order-detail/order-detail?id=${order.id}` }), 1000);
    } catch (e) { this.setData({ submitting: false }); }
  },

  formatPrice
});
