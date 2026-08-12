// packages/utils/src/format.ts
export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN');
}
