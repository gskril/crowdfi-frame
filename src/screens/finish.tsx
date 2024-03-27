import { FrameContext } from 'frog'

import { backgroundStyles } from '../styles'

export const finishScreen = async (c: FrameContext) => {
  return c.res({
    image: (
      <div style={{ ...backgroundStyles }}>
        <span>Thanks for contributing!</span>
      </div>
    ),
  })
}
