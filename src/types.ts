import { Hex } from 'viem'
import { mainnet, base, optimism, zora } from 'viem/chains'

export const supportedChains = [mainnet, base, optimism, zora]
export const supportedChainIds = supportedChains.map((c) => c.id)
export type SupportedChain = (typeof supportedChains)[number]

export type Campaign = {
  metadata: {
    photo_urls: Array<string>
    created_at: number
    id: number
    slug: string
    title: string
    description: string
  }
  contract: {
    chain_id: SupportedChain['id']
    txn_state: string
    contract_address: Hex
    txn_hash: Hex
    block_number: string
    processed_txn_hash: any
    processed_block_number: any
    recipient_address: Hex
    goal_max: number
    min_deposit: number
    max_deposit: number
    goal: number
    duration: number
    token: {
      symbol: string
      address: Hex | null
      decimals: number
      erc20: boolean
    }
  }
  status: {
    percent_funded: number
    num_contributors: number
    starts_at: number
    ends_at: number
    processed_at: any
    max_goal_met_at: any
    goal: number
    deposits: number
    processed: boolean
    outcome: string
    yields: number
    apy: number
  }
  creator: {
    ens_name: string
    pfp_url: string
    primary_account: Hex
    id: string
    name: string
    verifications: Array<any>
  }
  quilt: {
    art: string
    background: string
    foreground: string
  }
  updates: Array<{
    created_at: number
    content: string
  }>
}
