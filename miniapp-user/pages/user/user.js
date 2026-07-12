const api = require('../../utils/api');

Page({
  data: { userInfo: null, isLogin: false },

  onShow() {
    const app = getApp();
    if (app.globalData.token) {
      this.setData({ isLogin: true, userInfo: app.globalData.userInfo });
      this.loadUserInfo();
    } else {
      this.setData({ isLogin: false });
    }
  },

  async loadUserInfo() {
    try {
      const info = await api.getUserInfo();
      const app = getApp();
      app.globalData.userInfo = info;
      wx.setStorageSync('userInfo', info);
      this.setData({ userInfo: info });
    } catch (e) {}
  },

  goLogin() { wx.navigateTo({ url: '/pages/login/login' }); },
  goAddress() { wx.navigateTo({ url: '/pages/address/address' }); },
  goOrders() { wx.switchTab({ url: '/pages/order-list/order-list' }); },

  logout() {
    wx.showModal({ title: '提示', content: '确定退出登录？', success: (res) => {
      if (res.confirm) {
        const app = getApp();
        app.globalData.token = '';
        app.globalData.userInfo = null;
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        this.setData({ isLogin: false, userInfo: null });
      }
    }});
  }
});
