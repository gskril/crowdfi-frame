import { TransactionContext } from 'frog'
import { parseUnits, parseEther } from 'viem'
import { Env } from 'hono/types'

import { getCampaign } from '../crowdfi'
import { supportedChainIds } from '../types'
import { CROWDFi_ABI } from '../abi'

export const contributeTx = async (
  c: TransactionContext<Env, '/:campaignId/contribute/tx'>
) => {
  const { campaignId } = c.req.param()
  const inputValue = c.inputText || c.req.query('inputText')
  if (!inputValue) throw new Error('Invalid input')

  const campaign = await getCampaign(campaignId)
  if (!campaign) throw new Error('Campaign not found')

  if (!supportedChainIds.includes(campaign.contract.chain_id)) {
    throw new Error('Chain not supported')
  }

  // Handle ERC20 contributions
  // TODO: handle approval flow
  if (campaign.contract.token.erc20) {
    return c.contract({
      chainId: `eip155:${campaign.contract.chain_id}`,
      to: campaign.contract.contract_address,
      abi: CROWDFi_ABI,
      functionName: 'contributeERC20',
      args: [parseUnits(inputValue, campaign.contract.token.decimals)],
    })
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
