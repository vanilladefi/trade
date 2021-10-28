import { UniswapVersion } from 'types/general'
import { Token } from 'types/trade'

export type PrerenderProps = {
  walletAddress?: string | false
  vnlBalance?: string | null
  ethBalance?: string | null
  initialTokens?: {
    v2?: Token[]
    v3?: Token[]
    userPositionsV3: Token[] | null
    userPositionsV2: Token[] | null
  }
  ethPrice?: number
  currentBlockNumber?: number
}

export type BodyProps = PrerenderProps & {
  setModalOpen: (exchange: UniswapVersion) => void
  activeExchange: UniswapVersion
}
