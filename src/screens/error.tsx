import { FrameContext } from 'frog'

import { backgroundStyles } from '../styles'

export const errorScreen = (c: FrameContext) => {
  return c.res({
    image: (
      <div style={{ ...backgroundStyles }}>
        <span>Something went wrong</span>
      </div>
    ),
  })
}
