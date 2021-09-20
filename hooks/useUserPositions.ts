import { isAddress } from 'ethers/lib/utils'
import { getUserPositions } from 'lib/vanilla'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  uniswapV2TokenState,
  uniswapV3TokenState,
  userV2TokensState,
  userV3TokensState,
} from 'state/tokens'
import { selectedCounterAsset } from 'state/trade'
import { UniswapVersion, VanillaVersion } from 'types/general'
import { Token } from 'types/trade'
import useETHPrice from './useETHPrice'
import useVanillaGovernanceToken from './useVanillaGovernanceToken'
import useVanillaRouter from './useVanillaRouter'

function useUserPositions(
  version: VanillaVersion,
  walletAddress: string,
): Token[] | null {
  useETHPrice(UniswapVersion.v3)
  const allTokens = useRecoilValue(
    version === VanillaVersion.V1_0 ? uniswapV2TokenState : uniswapV3TokenState,
  )
  const counterAsset = useRecoilValue(selectedCounterAsset)
  const [tokens, setTokens] = useRecoilState(
    version === VanillaVersion.V1_0 ? userV2TokensState : userV3TokensState,
  )
  const vanillaRouter = useVanillaRouter(version)
  const vnl = useVanillaGovernanceToken(version)

  useEffect(() => {
    const filterUserTokens = async (
      tokens: Token[],
    ): Promise<Token[] | null> => {
      let tokensWithBalance = []
      if (vanillaRouter && isAddress(walletAddress) && isAddress(vnl.address)) {
        try {
          tokensWithBalance = await getUserPositions(
            version,
            walletAddress,
            tokens,
          )
        } catch (e) {
          console.error(e)
        }
      }

      return tokensWithBalance
    }
    filterUserTokens(allTokens).then(setTokens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, counterAsset, setTokens, version])

  return tokens
}

export default useUserPositions
