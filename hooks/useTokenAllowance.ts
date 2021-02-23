import { Token, TokenAmount } from '@uniswap/sdk'
import { useTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'hooks/useSingleCallResult'
import { useMemo } from 'react'

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string,
): TokenAmount | undefined {
  const contract = useTokenContract(token?.address)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(
    () =>
      token && allowance
        ? new TokenAmount(token, allowance.toString())
        : undefined,
    [token, allowance],
  )
}
