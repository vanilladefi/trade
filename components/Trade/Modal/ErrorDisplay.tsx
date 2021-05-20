import { Column, Width } from 'components/grid/Flex'
import Icon, { IconUrls } from 'components/typography/Icon'
import React from 'react'

type ErrorDisplayProps = {
  error: string
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const ErrorDisplay = ({ error, setError }: ErrorDisplayProps): JSX.Element => (
  <>
    <div className='row error'>
      <Column width={Width.TWO}>
        <div className='center'>
          <Icon src={IconUrls.ALERT} />
        </div>
      </Column>
      <Column width={Width.TEN} shrink={true}>
        Something went wrong. Reason: <span className='code'>{error}</span> You
        can try again.{' '}
        <a onClick={() => setError(null)}>Dismiss notification</a>
      </Column>
    </div>
    <style jsx>{`
      .error {
        color: var(--alertcolor);
        background: var(--alertbackground);
        font-family: var(--bodyfont);
        font-weight: var(--bodyweight);
        font-size: 0.9rem;
        cursor: text;
        --iconsize: 1.5rem;
        border-top: 2px solid rgba(0, 0, 0, 0.1);
      }
      .error span,
      .error a,
      .error .code {
        display: inline-flex;
        flex-shrink: 1;
        word-break: break-all;
      }
      .code {
        font-family: var(--monofont);
        font-weight: var(--monoweight);
      }
      .error a {
        text-decoration: underline;
        margin-top: 0.5rem;
        cursor: pointer;
      }
    `}</style>
  </>
)

export default ErrorDisplay
