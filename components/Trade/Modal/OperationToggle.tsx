import { Operation } from 'types/trade'

type OperationToggleProps = {
  operation: Operation
  setOperation: React.Dispatch<React.SetStateAction<Operation>>
  sellDisabled?: boolean
  buyDisabled?: boolean
}

const OperationToggle: React.FC<OperationToggleProps> = ({
  operation,
  setOperation,
  sellDisabled,
  buyDisabled,
}: OperationToggleProps) => (
  <>
    <div className='toggleWrapper'>
      <button
        className={operation === Operation.Buy ? 'active' : undefined}
        onClick={() => setOperation(Operation.Buy)}
        disabled={buyDisabled}
      >
        Buy
      </button>
      <button
        className={operation === Operation.Sell ? 'active' : undefined}
        onClick={() => setOperation(Operation.Sell)}
        disabled={sellDisabled}
      >
        Sell
      </button>
    </div>
    <style jsx>{`
      .toggleWrapper {
        width: 100%;
        position: relative;
        display: flex;
        padding: 6px;
        flex-direction: row;
        justify-content: stretch;
        border-radius: 9999px;
        background: var(--toggleWrapperGradient);
      }
      .toggleWrapper button {
        flex-grow: 1;
        background: transparent;
        border: 0;
        border-radius: 9999px;
        cursor: pointer;
        outline: 0;
        font-family: var(--bodyfont);
        font-size: var(--largebuttonsize);
        padding: 0.6rem;
        text-transform: uppercase;
        font-weight: var(--bodyweight);
      }
      .toggleWrapper button.active {
        background: white;
        font-weight: var(--buttonweight);
      }
    `}</style>
  </>
)

export default OperationToggle
