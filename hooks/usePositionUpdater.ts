import { Token as UniswapToken, TokenAmount } from '@uniswap/sdk-core'
import { BigNumber } from 'ethers'
import { getAddress } from 'ethers/lib/utils'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  uniswapV2TokenState,
  uniswapV3TokenState,
  userV2TokensState,
  userV3TokensState,
} from 'state/tokens'
import { VanillaVersion } from 'types/general'
import type { Token } from 'types/trade'
import { Eligibility } from 'types/trade'

export type PositionUpdater = (token: Token, delta: BigNumber) => void

function usePositionUpdater(version: VanillaVersion): PositionUpdater {
  const setUserTokensV2 = useSetRecoilState(userV2TokensState)
  const setUserTokensV3 = useSetRecoilState(userV3TokensState)

  const allV2Tokens = useRecoilValue(uniswapV2TokenState)
  const allV3Tokens = useRecoilValue(uniswapV3TokenState)

  const positionUpdater: PositionUpdater = (token: Token, delta: BigNumber) => {
    let stateUpdater: (
      valOrUpdater:
        | Token[]
        | ((currVal: Token[] | null) => Token[] | null)
        | null,
    ) => void
    
    let allTokens: Token[]

    switch (version) {
      case VanillaVersion.V1_0:
        stateUpdater = setUserTokensV2
        allTokens = allV2Tokens
        break
      case VanillaVersion.V1_1:
        stateUpdater = setUserTokensV3
        allTokens = allV3Tokens
        break
      default:
        stateUpdater = setUserTokensV3
        allTokens = allV3Tokens
    }

    stateUpdater((current) => {
      if (current?.length && token && delta) {
        let newTokens = [...current]
        const userHasAPosition = newTokens.find(
          (currentPosition) => currentPosition.address === token.address,
        )
        if (userHasAPosition) {
          newTokens = newTokens
            .map((currentPosition) => {
              if (currentPosition.address === token.address) {
                const newRaw = BigNumber.from(currentPosition.ownedRaw).add(
                  delta,
                )

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
        } else {
          const tokenFromAllTokens =
            allTokens.find(
              (availableToken) => availableToken.address === token.address,
            ) || token

          const parsedUniToken = new UniswapToken(
            Number(token.chainId),
            getAddress(token.address),
            Number(token.decimals),
          )

          const tokenAmount = new TokenAmount(parsedUniToken, delta.toString())

          const parsedOwnedAmount = tokenAmount.greaterThan('0')
            ? tokenAmount.toSignificant()
            : undefined

          const newPosition: Token = {
            owned: parsedOwnedAmount,
            ownedRaw: delta.toString(),
            eligible: Eligibility.Eligible,
            vnl: 0,
            ...token,
            ...tokenFromAllTokens,
          }
          newTokens.push(newPosition)
          return newTokens
        }
      }
      return current
    })
  }

  return positionUpdater
}

export default usePositionUpdater
