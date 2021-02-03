import debounce from 'lodash.debounce'
import { useEffect, useState } from 'react'
import { BreakPoint } from '../components/GlobalStyles/Breakpoints'

import type {
  BreakPoints,
  BreakPointOptions,
} from '../components/GlobalStyles/Breakpoints'

function isWindowClient(): boolean {
  return typeof window === 'object'
}

function parseSmallerThan(): BreakPointOptions {
  const width = isWindowClient() ? window.innerWidth : BreakPoint.xl
  return {
    xs: width <= BreakPoint.xs,
    sm: width <= BreakPoint.sm,
    md: width <= BreakPoint.md,
    lg: width <= BreakPoint.lg,
    xl: width <= BreakPoint.xl,
  }
}

function parseBiggerThan(): BreakPointOptions {
  const width = isWindowClient() ? window.innerWidth : BreakPoint.xl
  return {
    xs: width > BreakPoint.xs,
    sm: width > BreakPoint.sm,
    md: width > BreakPoint.md,
    lg: width > BreakPoint.lg,
    xl: width > BreakPoint.xl,
  }
}

export function useBreakpoints(): BreakPoints {
  const [isSmaller, setIsSmaller] = useState(parseSmallerThan)
  const [isBigger, setIsBigger] = useState(parseBiggerThan)

  useEffect(() => {
    const update = debounce(() => {
      setIsSmaller(parseSmallerThan())
      setIsBigger(parseBiggerThan())
    }, 300)
    update()
    if (isWindowClient()) window.addEventListener('resize', update)
    return () => {
      if (isWindowClient()) window.removeEventListener('resize', update)
    }
  }, [])

  return { isSmaller, isBigger }
}
