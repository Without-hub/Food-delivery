Page({
  data: {
    username: '',
    password: '',
    loading: false
  },
  onInputUsername(e) { this.setData({ username: e.detail.value }); },
  onInputPassword(e) { this.setData({ password: e.detail.value }); },
  async handleLogin() {
    const { username, password } = this.data;
    if (!username || !password) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    try {
      const api = require('../../utils/api');
      const token = await api.login({ username, password });
      const app = getApp();
      app.globalData.token = token;
      wx.setStorageSync('token', token);
      // 获取用户信息
      const userInfo = await api.getUserInfo();
      app.globalData.userInfo = userInfo;
      app.globalData.userId = userInfo.id;
      wx.setStorageSync('userInfo', userInfo);
      wx.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1000);
    } catch (e) {
      // 错误已在 request.js 中处理
    } finally {
      this.setData({ loading: false });
    }
  },
  goRegister() {
    wx.navigateTo({ url: '/pages/register/register' });
  }
});
