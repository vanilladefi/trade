import { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { tokenSearchQuery } from 'state/tokenSearch'

export default function useTokenSearch(): [string, () => void] {
  const [query, setQuery] = useRecoilState(tokenSearchQuery)
  const clearQuery = useCallback(() => {
    setQuery('')
  }, [setQuery])

  return [query, clearQuery]
}
