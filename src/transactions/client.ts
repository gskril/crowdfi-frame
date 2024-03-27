import { createPublicClient, http } from 'viem'
import { base, optimism, zora } from 'viem/chains'

import { SupportedChain } from '../types'

export function getClientByChainId(chainId: SupportedChain['id']) {
  let chain

  // TODO: do this more elegantly
  switch (chainId) {
    case base.id:
      chain = base
      break
    case optimism.id:
      chain = optimism
      break
    case zora.id:
      chain = zora
      break
    default:
      throw new Error(`Unsupported chain id: ${chainId}`)
  }

  return createPublicClient({
    chain,
    transport: http(),
  })
}
