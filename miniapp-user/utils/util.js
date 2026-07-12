// 工具函数

// 订单状态文本
function getOrderStatusText(status) {
  const map = ['待支付', '已支付/待接单', '配送中', '已完成', '已取消'];
  return map[status] || '未知';
}

// 订单状态标签样式类
function getOrderStatusClass(status) {
  const map = ['tag-warning', 'tag-primary', 'tag-primary', 'tag-success', 'tag-default'];
  return map[status] || 'tag-default';
}

// 格式化金额（分转元，保留两位小数）
function formatPrice(price) {
  if (price === null || price === undefined) return '0.00';
  return Number(price).toFixed(2);
}

// 格式化时间
function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

// 显示加载中
function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true });
}

// 隐藏加载
function hideLoading() {
  wx.hideLoading();
}

// 防抖
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

module.exports = {
  getOrderStatusText,
  getOrderStatusClass,
  formatPrice,
  formatTime,
  showLoading,
  hideLoading,
  debounce
};
