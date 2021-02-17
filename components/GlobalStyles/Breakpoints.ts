export interface BreakPointOptions {
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
}

export interface BreakPoints {
  isSmaller: BreakPointOptions
  isBigger: BreakPointOptions
}

export enum BreakPoint {
  xs = 320,
  sm = 640,
  mobileNav = 680,
  md = 1024,
  lg = 1280,
  xl = 1400,
}
