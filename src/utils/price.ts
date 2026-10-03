import type { StaticValues } from 'src/composables/useMenu';

const sizes = [
  ['S', 'small_price'],
  ['M', 'medium_price'],
  ['L', 'large_price'],
] as const;

export type PriceTag = { size?: string; amount: string };

export function formatAmount(value: number) {
  return `${value.toLocaleString('tr-TR')} ₺`;
}

/** One price shows on its own, several are labelled S / M / L. */
export function priceTags(values: StaticValues): PriceTag[] {
  const present = sizes.filter(([, field]) => values[field] != null);
  if (present.length === 1) {
    return [{ amount: formatAmount(values[present[0][1]]!) }];
  }
  return present.map(([size, field]) => ({
    size,
    amount: formatAmount(values[field]!),
  }));
}
