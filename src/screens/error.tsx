import { FrameContext } from 'frog'

import { backgroundStyles } from '../styles'
import { Logo } from '../logo'

export const errorScreen = (c: FrameContext, errorMsg?: string) => {
  return c.res({
    image: (
      <div style={{ ...backgroundStyles }}>
        <span>{errorMsg || 'Something went wrong :/'}</span>

        <Logo />
      </div>
    ),
  })
}
