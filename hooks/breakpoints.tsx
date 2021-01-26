import debounce from 'lodash.debounce'
import { useEffect, useState } from 'react'
import {
  BreakPoint,
  breakPointOptions,
} from '../components/GlobalStyles/Breakpoints'

function isWindowClient(): boolean {
  return typeof window === 'object'
}

function parseSmallerThan(): breakPointOptions {
  const width = isWindowClient() ? window.innerWidth : null
  return width
    ? {
        xs: width <= BreakPoint.xs,
        sm: width <= BreakPoint.sm,
        md: width <= BreakPoint.md,
        lg: width <= BreakPoint.lg,
        xl: width <= BreakPoint.xl,
      }
    : {
        xs: false,
        sm: false,
        md: false,
        lg: false,
        xl: false,
      }
}

function matchSizeToBreakPoint(): keyof breakPointOptions {
  const width = isWindowClient() ? window.innerWidth : null
  if (width) {
    if (width <= BreakPoint.xs) return 'xs' as keyof breakPointOptions
    if (width <= BreakPoint.sm) return 'sm' as keyof breakPointOptions
    if (width <= BreakPoint.md) return 'md' as keyof breakPointOptions
    if (width <= BreakPoint.lg) return 'lg' as keyof breakPointOptions
  }
  return 'xl' as keyof breakPointOptions
}

export const useIsSmallerThan = (): breakPointOptions => {
  const [smallerThan, setSmallerThan] = useState<breakPointOptions>(
    parseSmallerThan
  )

  useEffect(() => {
    const update = debounce(() => setSmallerThan(parseSmallerThan()), 300)
    if (isWindowClient()) window.addEventListener('resize', update)
    return () => {
      if (isWindowClient()) window.removeEventListener('resize', update)
    }
  }, [setSmallerThan])

  return smallerThan
}

export const useCurrentBreakPoint = (): keyof breakPointOptions => {
  const [currentBreakPoint, setCurrentBreakPoint] = useState<
    keyof breakPointOptions
  >(matchSizeToBreakPoint)

  useEffect(() => {
    const update = debounce(
      () => setCurrentBreakPoint(matchSizeToBreakPoint()),
      300
    )
    if (isWindowClient()) window.addEventListener('resize', update)
    return () => {
      if (isWindowClient()) window.removeEventListener('resize', update)
    }
  }, [setCurrentBreakPoint])

  return currentBreakPoint
}
