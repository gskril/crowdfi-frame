import { Button, Env, FrameContext, TextInput } from 'frog'
import { formatUnits } from 'viem'

import { backgroundStyles } from '../styles'
import { getCampaign } from '../crowdfi'
import { errorScreen } from './error'

export const contributeScreen = async (
  c: FrameContext<Env, '/:campaignId/contribute'>
) => {
  const { campaignId } = c.req.param()

  const campaign = await getCampaign(campaignId)
  if (!campaign) return errorScreen(c)

  const isOpenEnded = campaign.contract.goal === 1e36
  const isErc20 = campaign.contract.token.erc20
  const isActive = campaign.status.ends_at > Date.now()

  const normalizedDeposits = formatUnits(
    BigInt(campaign.status.deposits),
    campaign.contract.token.decimals
  )

  const normalizedGoal = formatUnits(
    BigInt(campaign.status.goal),
    campaign.contract.token.decimals
  )

  return c.res({
    image: (
      <div
        style={{
          ...backgroundStyles,
        }}
      >
        <span style={{ fontSize: 92 }}>{campaign.metadata.title}</span>

        {isOpenEnded ? (
          <span>
            {normalizedDeposits}/{normalizedGoal}{' '}
            {campaign.contract.token.symbol} raised
          </span>
        ) : (
          <span>
            {normalizedDeposits} {campaign.contract.token.symbol} raised (open
            ended)
          </span>
        )}

        <span>{campaign.status.num_contributors} contributors</span>
        <span>
          Started {new Date(campaign.status.starts_at).toLocaleDateString()}
        </span>
        <span>
          Ends {new Date(campaign.status.ends_at).toLocaleDateString()}{' '}
          {!isActive && '(no longer active)'}
        </span>
      </div>
    ),
    intents: [
      <TextInput
        placeholder={`Contribution Amount (${campaign.contract.token.symbol})`}
      />,
      <Button.Link href="https://crowdfi.withfabric.xyz/campaign/farcon-2024-pre-commit-4x2ya8uejw8w">
        Visit Fabric
      </Button.Link>,
      !!isActive && (
        <Button.Transaction target={`/campaign/${campaignId}/contribute/tx`}>
          Contribute
        </Button.Transaction>
      ),
    ],
  })
}
