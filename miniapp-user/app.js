// app.js
App({
  globalData: {
    userInfo: null,
    token: '',
    userId: null,
    cartCount: 0
  },

  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (token) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.userId = userInfo ? userInfo.id : null;
    }
  },

  // 检查是否已登录
  checkLogin() {
    return !!this.globalData.token;
  },

  // 显示登录提示并跳转
  requireLogin() {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 1500
    });
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/login/login' });
    }, 1500);
  }
});
