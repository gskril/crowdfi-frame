import { Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

import { homeScreen } from './screens/start'
import { finishScreen } from './screens/finish'
import { getFonts } from './fonts'
import { contributeScreen } from './screens/contribute'
import { contributeTx } from './transactions/contribute-tx'

export const app = new Frog({
  browserLocation: 'https://crowdfi.withfabric.xyz/campaign/:campaignId',
  imageOptions: async () => ({
    fonts: await getFonts(),
  }),
})

app.frame('/campaign/:campaignId', homeScreen)
app.frame('/campaign/:campaignId/contribute', contributeScreen)
app.frame('/campaign/:campaignId/finish', finishScreen)

app.transaction('/campaign/:campaignId/contribute/tx', contributeTx)

devtools(app, { serveStatic })

export default app
