import { Percent } from '@uniswap/sdk'
import { ReactNode } from 'react'
import Dropdown, { Option } from 'react-dropdown'
import { useRecoilState } from 'recoil'
import { selectedSlippageTolerance } from 'state/trade'

const slippagePrecision = '1000'

type slippageOptions = {
  '0.1': Percent
  '0.5': Percent
  '1': Percent
  '2': Percent
  '5': Percent
}

const slippageOptions = {
  '0.1': new Percent('1', slippagePrecision),
  '0.5': new Percent('5', slippagePrecision),
  '1': new Percent('10', slippagePrecision),
  '2': new Percent('20', slippagePrecision),
  '5': new Percent('50', slippagePrecision),
}

const returnOptionWithLabel = (
  percent: Percent,
): { value: string; label: string } => {
  return {
    value: percent.toSignificant(),
    label: percent.toSignificant() + ' %',
  }
}

type ArrowProps = {
  children: ReactNode
}

const ArrowWrapper = ({ children }: ArrowProps): JSX.Element => (
  <>
    <span>{children}</span>
    <style jsx>{`
      span {
        display: flex;
        width: 2rem;
        height: 2rem;
        background: var(--dark);
        border-radius: 50%;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </>
)

const ArrowClosed = (): JSX.Element => (
  <ArrowWrapper>
    <img src='images/caret.svg' />
  </ArrowWrapper>
)

const ArrowOpen = (): JSX.Element => (
  <>
    <ArrowWrapper>
      <img src='images/caret.svg' />
    </ArrowWrapper>
    <style jsx>{`
      img {
        transform: scaleY(-1);
      }
    `}</style>
  </>
)

const SlippageSelector = (): JSX.Element => {
  const mappedSlippageOptions = Object.values(slippageOptions).map(
    returnOptionWithLabel,
  )
  const [slippageTolerance, setSlippageTolerance] = useRecoilState(
    selectedSlippageTolerance,
  )
  const handleChange = (option: Option): void => {
    const slippagePercentage = option.value as keyof slippageOptions
    if (slippagePercentage) {
      setSlippageTolerance(slippageOptions[slippagePercentage])
    }
  }
  return (
    <>
      <Dropdown
        options={mappedSlippageOptions}
        onChange={handleChange}
        value={returnOptionWithLabel(slippageTolerance)}
        className='slippageSelector'
        arrowClosed={<ArrowClosed />}
        arrowOpen={<ArrowOpen />}
      />
      <style jsx global>{`
        .slippageSelector {
          display: flex;
          flex-direction: column;
          font-family: var(--bodyfont);
          font-size: var(--bodysize);
          cursor: pointer;
          position: relative;
          box-shadow: none;
          background: var(--white);
          transition: 0.3s ease box-shadow;
        }
        .slippageSelector.is-open {
          box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
        }
        .slippageSelector div {
          display: flex;
        }
        .Dropdown-placeholder {
          padding: 0 0 0 0.5rem;
        }
        .Dropdown-control {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }
        .Dropdown-control .Dropdown-arrow-wrapper {
          margin-left: 0.4rem;
        }
        .Dropdown-menu {
          position: absolute;
          display: flex;
          flex-direction: column;
          background: var(--white);
          padding: 0.2rem 0;
          width: 100%;
          z-index: 8;
          top: 100%;
          height: max-content;
          box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
        }
        .Dropdown-option {
          position: relative;
          width: 100%;
          z-index: 9;
          padding: 0.2rem 0.5rem;
          background: inherit;
          transition: 0.1s ease background;
        }
        .Dropdown-option:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  )
}

export default SlippageSelector
