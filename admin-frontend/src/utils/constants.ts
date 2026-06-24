export const PAGE_SIZE = 10;

export const ORDER_STATUS_OPTIONS = [
  { label: '待支付', value: 0 },
  { label: '待接单', value: 1 },
  { label: '备餐中', value: 2 },
  { label: '配送中', value: 3 },
  { label: '已完成', value: 4 },
  { label: '已取消', value: 5 },
];

export const DISH_STATUS_OPTIONS = [
  { label: '在售', value: 1 },
  { label: '停售', value: 0 },
];

export const SHOP_STATUS_OPTIONS = [
  { label: '关闭', value: 0 },
  { label: '营业中', value: 1 },
  { label: '休息中', value: 2 },
];

export const USER_ROLE_OPTIONS = [
  { label: '管理员', value: 'admin' },
  { label: '商家', value: 'merchant' },
  { label: '骑手', value: 'rider' },
  { label: '用户', value: 'customer' },
];
