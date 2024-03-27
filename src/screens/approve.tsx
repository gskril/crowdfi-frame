import { Button, Env, FrameContext, TextInput } from 'frog'
import { Address, parseUnits } from 'viem'

import { backgroundStyles } from '../styles'
import { getCampaign } from '../crowdfi'
import { errorScreen } from './error'

export const approveScreen = async (
  c: FrameContext<Env, '/campaign/:campaignId/approve'>
) => {
  const { campaignId } = c.req.param()
  const inputValue = c.inputText || c.req.query('inputText')

  const campaign = await getCampaign(campaignId)
  if (!campaign) return errorScreen(c)
  if (!inputValue) return errorScreen(c, 'No input value')

  const tokenAddress = campaign.contract.token.address
  if (!tokenAddress) return errorScreen(c)

  const formattedContribution = parseUnits(
    inputValue,
    campaign.contract.token.decimals
  )

  return c.res({
    image: (
      <div style={{ ...backgroundStyles }}>
        <span>
          First allow the smart contract to access your {inputValue}{' '}
          {campaign.contract.token.symbol}
        </span>
        <span>Then contribute</span>
      </div>
    ),
    intents: [
      <Button.Transaction
        target={`/campaign/${campaignId}/contribute/approve-tx?amount=${inputValue}`}
        action={`/campaign/${campaignId}/contribute`}
      >
        Approve
      </Button.Transaction>,
      <Button.Transaction
        target={`/campaign/${campaignId}/contribute/tx?inputText=${inputValue}`}
      >
        Contribute
      </Button.Transaction>,
    ],
  })

  // return c.res({
  //   image: (
  //     <div style={{ ...backgroundStyles }}>
  //       <span>
  //         Contribute {inputValue} {campaign.contract.token.symbol}
  //       </span>
  //     </div>
  //   ),
  //   intents: [],
  // })
}
