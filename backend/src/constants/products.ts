export const ALLOWED_CREDITS = [
  500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
] as const;

export const SHIPPING_FEES: Record<string, number> = {
  cp: 0,
  op: 0,
};

export const LOW_STOCK_THRESHOLD = 6;
