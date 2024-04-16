import { Env, FrameContext } from 'frog'

import { backgroundStyles } from '../styles'
import { Logo } from '../logo'
import { getCampaign } from '../crowdfi'
import { errorScreen } from './error'

export const finishScreen = async (
  c: FrameContext<Env, 'campaign/:campaignId/finish'>
) => {
  const { campaignId } = c.req.param()

  const campaign = await getCampaign(campaignId)

  return c.res({
    image: (
      <div
        style={{
          ...backgroundStyles,
          backgroundColor: campaign?.quilt.background || '#8800FF',
        }}
      >
        <span>Thanks for contributing.</span>

        <Logo />
      </div>
    ),
  })
}
