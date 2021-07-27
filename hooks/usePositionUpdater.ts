import { Token as UniswapToken, TokenAmount } from '@uniswap/sdk-core'
import { BigNumber } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { useSetRecoilState } from 'recoil'
import { userV2TokensState, userV3TokensState } from 'state/tokens'
import { VanillaVersion } from 'types/general'
import { Token, UniSwapToken } from 'types/trade'

export type PositionUpdater = (token: UniSwapToken, delta: BigNumber) => void

function usePositionUpdater(version: VanillaVersion): PositionUpdater {
  const setUserTokensV2 = useSetRecoilState(userV2TokensState)
  const setUserTokensV3 = useSetRecoilState(userV3TokensState)

  const positionUpdater: PositionUpdater = (
    token: UniSwapToken,
    delta: BigNumber,
  ) => {
    let stateUpdater: (
      valOrUpdater:
        | Token[]
        | ((currVal: Token[] | null) => Token[] | null)
        | null,
    ) => void
    switch (version) {
      case VanillaVersion.V1_0:
        stateUpdater = setUserTokensV2
        break
      case VanillaVersion.V1_1:
        stateUpdater = setUserTokensV3
        break
      default:
        stateUpdater = setUserTokensV3
    }
    stateUpdater((current) => {
      if (current?.length && token && delta) {
        const newTokens = [...current]
          .map((currentPosition) => {
            if (currentPosition.address === token.address) {
              const newRaw = BigNumber.from(currentPosition.ownedRaw).add(delta)

              const parsedUniToken = new UniswapToken(
                Number(token.chainId),
                getAddress(token.address),
                Number(token.decimals),
              )

              const tokenAmount = new TokenAmount(
                parsedUniToken,
                newRaw.toString(),
              )

              const parsedOwnedAmount = tokenAmount.greaterThan('0')
                ? tokenAmount.toSignificant()
                : undefined

              currentPosition.owned = parsedOwnedAmount
              currentPosition.ownedRaw = newRaw.toString()
            }
            return currentPosition
          })
          .filter((token) => token.owned)
        return newTokens
      }
      return current
    })
  }

  return positionUpdater
}

export default usePositionUpdater
