export const Dots = (): JSX.Element => (
  <>
    <div className='lds-ellipsis'>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <style jsx>{`
      .lds-ellipsis {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
      }
      .lds-ellipsis div {
        position: absolute;
        top: 33px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: var(--dark);
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
      }
      .lds-ellipsis div:nth-child(1) {
        left: 8px;
        animation: lds-ellipsis1 0.6s infinite;
      }
      .lds-ellipsis div:nth-child(2) {
        left: 8px;
        animation: lds-ellipsis2 0.6s infinite;
      }
      .lds-ellipsis div:nth-child(3) {
        left: 32px;
        animation: lds-ellipsis2 0.6s infinite;
      }
      .lds-ellipsis div:nth-child(4) {
        left: 56px;
        animation: lds-ellipsis3 0.6s infinite;
      }
      @keyframes lds-ellipsis1 {
        0% {
          transform: scale(0);
        }
        100% {
          transform: scale(1);
        }
      }
      @keyframes lds-ellipsis3 {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(0);
        }
      }
      @keyframes lds-ellipsis2 {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(24px, 0);
        }
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
