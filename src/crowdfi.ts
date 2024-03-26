import { Campaign } from './types'

export async function getCampaign(id: string) {
  const res = await fetch(`https://loom.withfabric.xyz/api/v1/campaigns/${id}/`)
  if (!res.ok) return null
  return (await res.json()) as Campaign
}
