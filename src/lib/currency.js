const RWF_CURRENCY = "RWF";

export function formatCurrency(amount) {
  const value = Number(amount);

  return `${RWF_CURRENCY} ${new Intl.NumberFormat("en-RW", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)}`;
}

export { RWF_CURRENCY };
