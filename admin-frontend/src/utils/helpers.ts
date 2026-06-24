import dayjs from 'dayjs';

export function formatDate(date: string | undefined, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return '-';
  return dayjs(date).format(format);
}

export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined || amount === null) return '¥0.00';
  return `¥${amount.toFixed(2)}`;
}

export function formatPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(7)}`;
}
