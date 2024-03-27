import { Button, Env, FrameContext, TextInput } from 'frog'
import { formatUnits } from 'viem'

import { backgroundStyles } from '../styles'
import { getCampaign } from '../crowdfi'
import { errorScreen } from './error'
import { getRelativeTimeString } from '../utils'

export const contributeScreen = async (
  c: FrameContext<Env, '/:campaignId/contribute'>
) => {
  const { campaignId } = c.req.param()

  const campaign = await getCampaign(campaignId)
  if (!campaign) return errorScreen(c)

  const isOpenEnded = campaign.contract.goal === 1e36
  const isErc20 = campaign.contract.token.erc20
  const isActive = campaign.status.ends_at > Date.now()

  const normalizedDeposits = Number(
    formatUnits(
      BigInt(campaign.status.deposits),
      campaign.contract.token.decimals
    )
  ).toFixed(2)

  const normalizedGoal = Number(
    formatUnits(BigInt(campaign.status.goal), campaign.contract.token.decimals)
  ).toFixed(2)

  const relativeEndTime = getRelativeTimeString(campaign.status.ends_at)

  return c.res({
    image: (
      <div style={{ ...backgroundStyles }}>
        <span style={{ fontSize: 64, paddingBottom: 64 }}>
          {campaign.metadata.title}
        </span>

        <span>{campaign.status.num_contributors} contributors</span>

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

        <span>
          Started {new Date(campaign.status.starts_at).toLocaleDateString()},
          ends {relativeEndTime} {!isActive && '(no longer active)'}
        </span>

        <span>
          {formatUnits(
            BigInt(campaign.contract.min_deposit),
            campaign.contract.token.decimals
          )}{' '}
          {campaign.contract.token.symbol} min contribution
        </span>
      </div>
    ),
    intents: [
      <TextInput
        placeholder={`Contribution Amount (${campaign.contract.token.symbol})`}
      />,
      <Button.Link
        href={`https://crowdfi.withfabric.xyz/campaign/${campaign.metadata.slug}`}
      >
        Visit Fabric
      </Button.Link>,
      !isActive ? null : isErc20 ? (
        // handle ERC20 approval flow
        <Button action={`/campaign/${campaignId}/approve`}>Contribute</Button>
      ) : (
        // handle ETH contribution flow
        <Button.Transaction
          action={`/campaign/${campaignId}/finish`}
          target={`/campaign/${campaignId}/contribute/tx`}
        >
          Contribute
        </Button.Transaction>
      ),
    ],
  })
}
