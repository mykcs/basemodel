export function displayUnknown(value: unknown, suffix = ''): string {
  if (value === null || value === undefined || value === 'unknown') return '未知';
  if (typeof value === 'boolean') return value ? '是' : '否';
  return `${value}${suffix}`;
}

export function displayBoolean(value: boolean | 'unknown') {
  return value === 'unknown' ? '未知' : value ? '是' : '否';
}

export function statusLabel(status: string) {
  return { verified: '已核验', partial: '部分核验', demo: '演示数据', unknown: '未知' }[status] ?? status;
}

export function tierLabel(tier: string) {
  return { cpu_mac: 'CPU / Mac', '16gb': '16GB GPU', '24gb': '24GB GPU', '48gb': '48GB GPU', '80gb': '80GB GPU', multi_gpu: '多卡 GPU', api_only: '仅 API', unknown: '未知' }[tier] ?? tier;
}
