import { Button, Env, FrameContext, TextInput } from 'frog'
import { Address, parseUnits } from 'viem'

import { backgroundStyles } from '../styles'
import { getCampaign } from '../crowdfi'
import { errorScreen } from './error'
import { getClientByChainId } from '../transactions/client'
import { ERC20_ABI } from '../abi'

export const approveScreen = async (
  c: FrameContext<Env, '/campaign/:campaignId/approve'>
) => {
  const { campaignId } = c.req.param()
  const inputValue = c.inputText

  const userAddress = c.frameData?.address as Address | undefined

  if (!userAddress) return errorScreen(c, 'User address not found')

  const campaign = await getCampaign(campaignId)
  if (!campaign || !inputValue) return errorScreen(c)

  const tokenAddress = campaign.contract.token.address
  if (!tokenAddress) return errorScreen(c)

  const formattedContribution = parseUnits(
    inputValue,
    campaign.contract.token.decimals
  )

  const client = getClientByChainId(campaign.contract.chain_id)

  // Check if the user already has a token approval
  const allowance = await client.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [userAddress, campaign.contract.contract_address],
  })

  if (allowance) {
    return c.res({
      image: (
        <div
          style={{
            ...backgroundStyles,
          }}
        >
          <span style={{ fontSize: 92 }}>{campaign.metadata.title}</span>
        </div>
      ),
      intents: [
        <Button.Transaction
          target={`/campaign/${campaignId}/contribute/tx?inputText=${inputValue}`}
        >
          Contribute
        </Button.Transaction>,
      ],
    })
  }

  return c.res({
    image: (
      <div
        style={{
          ...backgroundStyles,
        }}
      >
        <span style={{ fontSize: 92 }}>{campaign.metadata.title}</span>
      </div>
    ),
    intents: [],
  })
}
