export const formatPrice = (value: number, decimals: number = 2): string => {
  return value.toLocaleString("cs-CZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCurrency = (value: number): string => {
  return `${formatPrice(value)} Kč`;
};
