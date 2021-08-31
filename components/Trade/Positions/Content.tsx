export const CardinalityContent = (): JSX.Element => (
  <p>
    This token&apos;s price oracle currently has{' '}
    <strong style={{ color: 'red' }}>an observation cardinality of 1</strong> ,
    and will not result in any $VNL mined through profit mining. This can (and
    probably will) change in the future, and once the{' '}
    <a
      href='https://docs.uniswap.org/protocol/reference/core/libraries/Oracle'
      target='_blank'
      rel='noreferrer noopener'
    >
      observation cardinality
    </a>{' '}
    is increased, the problem is solved. This is to protect users and $VNL from
    price manipulation.
  </p>
)

export const LowLiquidityContent = (): JSX.Element => (
  <p>
    This token has
    <strong style={{ color: 'orange' }}> low liquidity</strong>, and pricing
    might be wrong. Buy with caution
  </p>
)

export const VeryLowLiquidityContent = (): JSX.Element => (
  <p>
    This token currently has{' '}
    <strong style={{ color: 'red' }}> very low liquidity</strong> and will not
    result in any $VNL mined through profit mining, and selling might be
    difficult
  </p>
)
