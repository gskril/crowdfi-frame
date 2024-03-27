import { FrameContext } from 'frog'

import { backgroundStyles } from '../styles'

export const errorScreen = (c: FrameContext, errorMsg?: string) => {
  return c.res({
    image: (
      <div
        style={{
          ...backgroundStyles,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span>{errorMsg || 'Something went wrong'}</span>
      </div>
    ),
  })
}
