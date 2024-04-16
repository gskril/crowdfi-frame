import { Button, FrameContext } from 'frog'
import { Env } from 'hono/types'

import { authorStyles, backgroundStyles } from '../styles'
import { getCampaign } from '../crowdfi'
import { errorScreen } from './error'
import { Logo } from '../logo'

export const homeScreen = async (
  c: FrameContext<Env, '/campaign/:campaignId'>
) => {
  const { campaignId } = c.req.param()

  const campaign = await getCampaign(campaignId)
  if (!campaign) return errorScreen(c)

  return c.res({
    image: (
      <div
        style={{
          ...backgroundStyles,
          backgroundColor: campaign.quilt.background,
        }}
      >
        <span>{campaign.metadata.title}</span>

        <span style={authorStyles}>
          {campaign.creator.ens_name || campaign.creator.name}
        </span>

        <Logo />
      </div>
    ),
    intents: [
      <Button action={`/campaign/${campaignId}/contribute`}>
        View Campaign
      </Button>,
    ],
  })
}
