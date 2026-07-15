Page({
  data: { username: '', phone: '', password: '', loading: false },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  async handleRegister() {
    const { username, phone, password } = this.data;
    if (!username || !phone || !password) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' }); return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' }); return;
    }
    if (password.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' }); return;
    }
    this.setData({ loading: true });
    try {
      const api = require('../../utils/api');
      await api.register({ username, phone, password, nickname: username });
      wx.showToast({ title: '注册成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1000);
    } catch (e) {} finally { this.setData({ loading: false }); }
  },
  goBack() { wx.navigateBack(); }
});
