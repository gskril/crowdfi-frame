import { TransactionContext } from 'frog'
import { parseEther, formatUnits } from 'viem'
import { Env } from 'hono/types'

import { getCampaign } from '../crowdfi'
import { supportedChainIds } from '../types'
import { CROWDFi_ABI } from '../abi'

export const contributeTx = async (
  c: TransactionContext<Env, '/:campaignId/contribute/tx'>
) => {
  const { campaignId } = c.req.param()

  const campaign = await getCampaign(campaignId)
  if (!campaign) throw new Error('Campaign not found')

  // Set the default input value to the minimum deposit amount
  const inputValue =
    c.inputText ||
    formatUnits(
      BigInt(campaign.contract.min_deposit),
      campaign.contract.token.decimals
    )

  if (!supportedChainIds.includes(campaign.contract.chain_id)) {
    throw new Error('Chain not supported')
  }

  // Handle ETH contributions
  return c.contract({
    chainId: `eip155:${campaign.contract.chain_id}`,
    to: campaign.contract.contract_address,
    abi: CROWDFi_ABI,
    functionName: 'contributeEth',
    value: parseEther(inputValue),
  })
}
