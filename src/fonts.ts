declare type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
declare type Style = 'normal' | 'italic'

export interface FontOptions {
  data: Buffer | ArrayBuffer
  name: string
  weight?: Weight
  style?: Style
  lang?: string
}

export async function getFonts() {
  // This should be a relative URL from the Worker but for some reason I can't get that working so this will do 🤷‍♂️
  const baseUrl =
    'https://github.com/gskril/crowdfi-frame/raw/main/assets/ABCDiatype'

  const weights = [400, 500, 600] satisfies Weight[]

  const fontDatas = await Promise.all(
    weights.map(async (weight) => {
      return await fetchFont(`${baseUrl}-${weight}.ttf`)
    })
  )

  return fontDatas.map((data, i) => {
    return {
      name: 'ABCDiatype',
      data,
      weight: weights[i],
      style: 'normal',
    } satisfies FontOptions
  })
}

async function fetchFont(url: string) {
  const res = await fetch(url, { cf: { cacheTtl: 31_536_000 } })
  return res.arrayBuffer()
}
