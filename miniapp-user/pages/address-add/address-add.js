const api = require('../../utils/api');

Page({
  data: { contactName: '', contactPhone: '', province: '', city: '', district: '', detail: '', loading: false },

  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },

  async save() {
    const { contactName, contactPhone, province, city, district, detail } = this.data;
    if (!contactName || !contactPhone || !detail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' }); return;
    }
    this.setData({ loading: true });
    try {
      await api.addAddress({ contactName, contactPhone, province, city, district, detail });
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1000);
    } catch (e) {} finally { this.setData({ loading: false }); }
  }
});
