import { formatUnits } from 'viem'

export function formatValue(value: number, decimals: number) {
  return new Intl.NumberFormat('en-US', {
    unitDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(Number(formatUnits(BigInt(value), decimals)))
}
