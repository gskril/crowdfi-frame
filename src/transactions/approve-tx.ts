import { TransactionContext } from 'frog'
import { parseUnits } from 'viem'
import { Env } from 'hono/types'

import { getCampaign } from '../crowdfi'
import { ERC20_ABI } from '../abi'

export const approveTx = async (
  c: TransactionContext<Env, '/campaign/:campaignId/contribute/approve-tx'>
) => {
  const { campaignId } = c.req.param()
  const amount = c.req.query('amount') || '0'

  console.log(amount)

  const campaign = await getCampaign(campaignId)
  if (!campaign) throw new Error('Campaign not found')

  return c.contract({
    chainId: `eip155:${campaign.contract.chain_id}`,
    to: campaign.contract.token.address!,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [
      campaign.contract.contract_address,
      parseUnits(amount, campaign.contract.token.decimals),
    ],
  })
}
