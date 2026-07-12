const api = require('../../utils/api');
const { showLoading, hideLoading } = require('../../utils/util');

Page({
  data: { addressList: [] },

  onShow() { this.loadAddresses(); },

  async loadAddresses() {
    showLoading();
    try {
      const list = await api.getAddressList();
      this.setData({ addressList: list || [] });
    } catch (e) {} finally { hideLoading(); }
  },

  setDefault(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({ title: '提示', content: '设为默认地址？', success: async (res) => {
      if (res.confirm) { await api.setDefaultAddress(id); this.loadAddresses(); }
    }});
  },

  deleteAddr(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({ title: '提示', content: '确定删除地址？', success: async (res) => {
      if (res.confirm) { await api.deleteAddress(id); this.loadAddresses(); }
    }});
  },

  addAddress() { wx.navigateTo({ url: '/pages/address-add/address-add' }); }
});
