import debounce from 'lodash.debounce'
import { useEffect, useState } from 'react'
import {
  BreakPoint,
  breakPointOptions
} from '../components/GlobalStyles/Breakpoints'

export const useIsSmallerThan = (): breakPointOptions => {
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

export const useCurrentBreakPoint = (): keyof breakPointOptions => {
  const isWindowClient = typeof window === 'object'

  const matchSizeToBreakPoint = (): keyof breakPointOptions => {
    if (isWindowClient) {
      if (window.innerWidth <= BreakPoint.xs)
        return 'xs' as keyof breakPointOptions
      if (window.innerWidth <= BreakPoint.sm)
        return 'sm' as keyof breakPointOptions
      if (window.innerWidth <= BreakPoint.md)
        return 'md' as keyof breakPointOptions
      if (window.innerWidth <= BreakPoint.lg)
        return 'lg' as keyof breakPointOptions
      if (window.innerWidth <= BreakPoint.xl)
        return 'xl' as keyof breakPointOptions
    }
    return 'xl' as keyof breakPointOptions
  }

  const [currentBreakPoint, setCurrentBreakPoint] = useState<
    keyof breakPointOptions
  >(matchSizeToBreakPoint())

  useEffect(() => {
    const updateSize = () => setCurrentBreakPoint(matchSizeToBreakPoint())
    if (isWindowClient) {
      window.addEventListener('resize', debounce(updateSize, 300))
      return () =>
        window.removeEventListener('resize', debounce(updateSize, 300))
    }
  }, [isWindowClient, setCurrentBreakPoint])

  return currentBreakPoint
}
