import debounce from 'lodash.debounce'
import { useEffect, useState } from 'react'
import { BreakPoint, breakPointOptions } from '../GlobalStyles/Breakpoints'

const useIsSmallerThan = (): breakPointOptions => {
  const isWindowClient = typeof window === 'object'

  const [smallerThan, setSmallerThan] = useState<breakPointOptions>(
    isWindowClient
      ? {
          xs: window.innerWidth < BreakPoint.xs,
          sm: window.innerWidth < BreakPoint.sm,
          md: window.innerWidth < BreakPoint.md,
          lg: window.innerWidth < BreakPoint.lg,
          xl: window.innerWidth < BreakPoint.xl,
        }
      : {
          xs: false,
          sm: false,
          md: false,
          lg: false,
          xl: false,
        }
  )

  useEffect(() => {
    const updateSize = () =>
      setSmallerThan({
        xs: window.innerWidth < BreakPoint.xs,
        sm: window.innerWidth < BreakPoint.sm,
        md: window.innerWidth < BreakPoint.md,
        lg: window.innerWidth < BreakPoint.lg,
        xl: window.innerWidth < BreakPoint.xl,
      })
    if (isWindowClient) {
      window.addEventListener('resize', debounce(updateSize, 300))
      return () =>
        window.removeEventListener('resize', debounce(updateSize, 300))
    }
  }, [isWindowClient, setSmallerThan])

  return smallerThan
}

export default useIsSmallerThan
