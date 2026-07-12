// 网络请求封装
const app = getApp();

const BASE_URL = 'http://localhost:8080';

function request(method, url, data, options = {}) {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token || wx.getStorageSync('token');
    const header = {};

    if (method === 'POST' || method === 'PUT') {
      header['Content-Type'] = 'application/json';
    }

    if (token) {
      header['token'] = token;
      header['Authorization'] = 'Bearer ' + token;
    }

    if (options.header) {
      Object.assign(header, options.header);
    }

    wx.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: header,
      timeout: options.timeout || 10000,
      success(res) {
        if (res.statusCode === 401) {
          // Token 过期或无效，跳登录
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          app.globalData.token = '';
          app.globalData.userInfo = null;
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/login/login' });
          }, 1500);
          reject(new Error('Unauthorized'));
          return;
        }

        const body = res.data;
        // 处理后端统一返回格式 { code, message, data }
        if (body && (body.code === 200 || body.code === undefined)) {
          resolve(body.data !== undefined ? body.data : body);
        } else if (body && body.code === 500) {
          wx.showToast({ title: body.message || '服务器错误', icon: 'none' });
          reject(new Error(body.message || 'Server error'));
        } else {
          resolve(body);
        }
      },
      fail(err) {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

module.exports = {
  get: (url, data, options) => request('GET', url, data, options),
  post: (url, data, options) => request('POST', url, data, options),
  put: (url, data, options) => request('PUT', url, data, options),
  del: (url, data, options) => request('DELETE', url, data, options),
};
