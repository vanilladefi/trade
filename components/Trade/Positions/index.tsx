import Wrapper from 'components/Wrapper'

export { default as MyPositionsV2 } from './v2/MyPositions'
export { default as MyPositionsV3 } from './v3/MyPositions'

type WrapperProps = {
  children: React.ReactNode
}

export const LoaderWrapper: React.FC = ({ children }: WrapperProps) => (
  <>
    <Wrapper>
      <div>{children}</div>
    </Wrapper>
    <style jsx>{`
      div {
        position: relative;
        display: flex;
        width: 100vw;
        padding: var(--tablepadding);
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </>
)
