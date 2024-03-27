import { Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

import { homeScreen } from './screens/start'
import { finishScreen } from './screens/finish'
import { getFont } from './fonts'
import { contributeScreen } from './screens/contribute'
import { contributeTx } from './transactions/contribute-tx'
import { approveTx } from './transactions/approve-tx'
import { approveScreen } from './screens/approve'

export const app = new Frog({
  imageOptions: async () => ({ fonts: [await getFont('satoshi')] }),
})

app.frame('/campaign/:campaignId', homeScreen)
app.frame('/campaign/:campaignId/contribute', contributeScreen)
app.frame('/campaign/:campaignId/approve', approveScreen)
app.frame('/campaign/:campaignId/finish', finishScreen)

app.transaction('/campaign/:campaignId/contribute/tx', contributeTx)
app.transaction('/campaign/:campaignId/contribute/approve-tx', approveTx)

devtools(app, { serveStatic })

export default app
