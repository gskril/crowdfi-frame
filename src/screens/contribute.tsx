import { Button, Env, FrameContext, TextInput } from 'frog'
import { formatUnits } from 'viem'

import { authorStyles, backgroundStyles } from '../styles'
import { getCampaign } from '../crowdfi'
import { errorScreen } from './error'
import { formatValue } from '../utils'
import { Logo } from '../logo'

export const contributeScreen = async (
  c: FrameContext<Env, '/:campaignId/contribute'>
) => {
  const { campaignId } = c.req.param()

  const campaign = await getCampaign(campaignId)
  if (!campaign) return errorScreen(c)

  const isOpenEnded = campaign.contract.goal_max === 1e36
  const isErc20 = campaign.contract.token.erc20
  const isActive = campaign.status.ends_at > Date.now()

  const normalizedDeposits = formatValue(
    campaign.status.deposits,
    campaign.contract.token.decimals
  )

  const normalizedGoal = formatValue(
    campaign.status.goal,
    campaign.contract.token.decimals
  )

  const minimumContribution = formatUnits(
    BigInt(campaign.contract.min_deposit),
    campaign.contract.token.decimals
  )

  return c.res({
    image: (
      <div style={backgroundStyles}>
        <div
          style={{
            display: 'flex',
            gap: 18,
            alignItems: isOpenEnded ? 'center' : 'flex-end',
          }}
        >
          <span>{normalizedDeposits}</span>
          <span style={{ opacity: 0.72 }}>
            / {isOpenEnded ? '∞' : normalizedGoal}{' '}
          </span>
          <span style={{ fontSize: 50, opacity: 0.72 }}>
            {campaign.contract.token.symbol}
          </span>
        </div>

        <span style={{ fontSize: 52 }}>{campaign.metadata.title}</span>

        <span style={authorStyles}>
          {campaign.creator.ens_name || campaign.creator.name}
        </span>

        <span style={{ fontSize: 34 }}>
          {campaign.status.num_contributors} contributor
          {campaign.status.num_contributors === 1 ? '' : 's'}
        </span>

        <Logo />
      </div>
    ),
    intents: [
      isErc20 ? null : isActive ? (
        <TextInput
          placeholder={`Amount (at least ${minimumContribution} ${campaign.contract.token.symbol})`}
        />
      ) : null,
      <Button.Link
        href={`https://crowdfi.withfabric.xyz/campaign/${campaign.metadata.slug}`}
      >
        View on Fabric
      </Button.Link>,
      isErc20 ? null : isActive ? (
        // handle ETH contribution flow
        <Button.Transaction
          action={`/campaign/${campaignId}/finish`}
          target={`/campaign/${campaignId}/contribute/tx`}
        >
          Contribute
        </Button.Transaction>
      ) : null,
    ],
  })
}
