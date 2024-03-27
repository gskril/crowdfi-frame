import { Button, FrameContext } from 'frog'
import { Env } from 'hono/types'

import { backgroundStyles } from '../styles'
import { getCampaign } from '../crowdfi'
import { errorScreen } from './error'

export const homeScreen = async (c: FrameContext<Env, '/:campaignId'>) => {
  const { campaignId } = c.req.param()

  const campaign = await getCampaign(campaignId)
  if (!campaign) return errorScreen(c)

  return c.res({
    image: (
      <div style={{ ...backgroundStyles }}>
        <span>Contribute to {campaign.metadata.title} on Fabric</span>
      </div>
    ),
    intents: [
      <Button action={`/campaign/${campaignId}/contribute`}>
        View Campaign
      </Button>,
    ],
  })
}
