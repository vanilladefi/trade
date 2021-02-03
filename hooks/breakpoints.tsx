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

export const useIsSmallerThan = (): breakPointOptions => {
  const [smallerThan, setSmallerThan] = useState<breakPointOptions>(
    parseSmallerThan,
  )

  useEffect(() => {
    const update = debounce(() => setSmallerThan(parseSmallerThan()), 300)
    update()
    if (isWindowClient()) window.addEventListener('resize', update)
    return () => {
      if (isWindowClient()) window.removeEventListener('resize', update)
    }
  }, [])

  return smallerThan
}
