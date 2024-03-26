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
      <div
        style={{
          ...backgroundStyles,
          backgroundImage: `url(${campaign.metadata.photo_urls[0]})`,
        }}
      />
    ),
    intents: [
      <Button action={`/campaign/${campaignId}/contribute`}>
        View Campaign
      </Button>,
    ],
  })
}
