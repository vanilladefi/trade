import 'three-dots'

export const Dots = (): JSX.Element => (
  <>
    <div className='dot-flashing' />
    <style jsx>{`
      .dot-flashing {
        color: black;
        background-color: black;
      }
    `}</style>
  </>
)

export const Spinner = (): JSX.Element => (
  <>
    <div className='wrapper'>
      <div className='spinner'>
        <div className='innerCircle' />
      </div>
    </div>
    <style jsx>{`
      .wrapper {
        position: relative;
        display: flex;
        flex-grow: 0;
        flex-shrink: 0;
      }
      .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--iconsize);
        height: var(--iconsize);
        border-radius: 50%;
        background: conic-gradient(#2c1929, rgba(44, 25, 41, 0));
        animation-name: spin;
        animation-duration: 1500ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        mix-blend-mode: darken;
      }
      .innerCircle {
        width: calc(var(--iconsize) - 10px);
        height: calc(var(--iconsize) - 10px);
        background: white;
        border-radius: 50%;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </>
)
