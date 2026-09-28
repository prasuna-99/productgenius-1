/**
 * Formats a monetary amount into Rupees (Rs)
 */
export const formatPrice = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs 0';
  }
  // Check if it has decimal places
  const hasDecimals = amount % 1 !== 0;
  return `Rs ${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
};

export const formatRs = formatPrice;
