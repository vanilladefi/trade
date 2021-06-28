import { Column } from 'components/grid/Flex'
import Button, {
  ButtonColor,
  ButtonSize,
  ButtonState,
  Rounding,
} from 'components/input/Button'
import { Spinner } from 'components/Spinner'
import useTradeEngine from 'hooks/useTradeEngine'
import useVanillaRouter from 'hooks/useVanillaRouter'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, Suspense, useEffect } from 'react'
import { VanillaVersion } from 'types/general'
import { Operation } from 'types/trade'
import ErrorDisplay from '../../ErrorDisplay'
import OperationToggle from '../../OperationToggle'
import TradeInfoDisplay from '../../TradeInfoDisplay'

type ContentProps = {
  operation: Operation
  setOperation: Dispatch<SetStateAction<Operation>>
  setModalCloseEnabled: Dispatch<SetStateAction<boolean>>
}

const TokenInput = dynamic(() => import('components/Trade/TokenInput'), {
  ssr: false,
})

enum TransactionState {
  PREPARE,
  PROCESSING,
  DONE,
}

type ButtonAmountDisplayProps = {
  operationText: string
  tokenAmount: string
  tokenSymbol: string
}

const ButtonAmountDisplay = ({
  operationText,
  tokenAmount,
  tokenSymbol,
}: ButtonAmountDisplayProps): JSX.Element => (
  <>
    <div>
      {operationText} <span>{tokenAmount}</span> {tokenSymbol}
    </div>
    <style jsx>{`
      div {
        position: relative;
        display: inline-flex;
        max-width: 100%;
        font-family: inherit;
        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        margin: 0;
        padding: 0;
        white-space: nowrap;
      }
      div span {
        display: inline-block;
        position: relative;
        font-family: inherit;
        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 0.2rem;
        margin-left: 0.2rem;
      }
    `}</style>
  </>
)

const PrepareView = ({
  operation,
  setOperation,
  setModalCloseEnabled,
}: ContentProps): JSX.Element => {
  const router = useRouter()

  const {
    token0,
    trade,
    error,
    setError,
    transactionState,
    setTransactionState,
    executeTrade,
    notEnoughFunds,
    notEnoughLiquidity,
    token0Amount,
    token1Amount,
  } = useTradeEngine(VanillaVersion.V1_0)

  // Vanilla router contract
  const vanillaRouter = useVanillaRouter(VanillaVersion.V1_0)

  // Disable closing of the trade modal when a trade is being processed
  useEffect(() => {
    ;[TransactionState.PROCESSING].includes(transactionState) &&
      setModalCloseEnabled(false)
    return () => {
      setModalCloseEnabled(true)
    }
  }, [setModalCloseEnabled, transactionState])

  return (
    <Suspense fallback={() => <div>Fetching pair data...</div>}>
      <section style={{ minWidth: '320px', maxWidth: '30rem' }}>
        <Column>
          <section
            className={`inputWrapper${
              [TransactionState.PROCESSING, TransactionState.DONE].includes(
                transactionState,
              )
                ? ' disabled'
                : ''
            }`}
          >
            <div className='row noBottomMargin'>
              <OperationToggle
                operation={operation}
                setOperation={setOperation}
                buyDisabled={true}
              />
            </div>

            <section className='modalMain'>
              <div className='row noBottomMargin'>
                <TokenInput version={VanillaVersion.V1_0} />
              </div>

              {token0Amount && trade?.executionPrice && vanillaRouter && (
                <div className='row'>
                  <TradeInfoDisplay version={VanillaVersion.V1_0} />
                </div>
              )}
            </section>
          </section>

          <div className='row footer'>
            {token0Amount !== '0' ? (
              <Button
                onClick={async () => {
                  const hash = await executeTrade()
                  // Wait for a bit, and then redirect the user to the TradeFlower view with more trade info
                  setTimeout(() => {
                    setTransactionState(TransactionState.PREPARE)
                    router.push(`/trade?id=${hash}`, undefined, {
                      shallow: true,
                    })
                  }, 1500)
                }}
                size={ButtonSize.LARGE}
                buttonState={
                  transactionState === TransactionState.PROCESSING
                    ? ButtonState.LOADING
                    : transactionState === TransactionState.DONE
                    ? ButtonState.SUCCESS
                    : ButtonState.NORMAL
                }
                disabled={
                  [TransactionState.PROCESSING, TransactionState.DONE].includes(
                    transactionState,
                  ) || notEnoughFunds()
                }
                grow
              >
                {token1Amount === null ? (
                  <Spinner />
                ) : notEnoughLiquidity() ? (
                  'Not enough liquidity'
                ) : notEnoughFunds() ? (
                  'Not enough funds'
                ) : transactionState === TransactionState.PREPARE ? (
                  <ButtonAmountDisplay
                    operationText={`${
                      operation.charAt(0).toUpperCase() + operation.slice(1)
                    }ing`}
                    tokenAmount={token0Amount}
                    tokenSymbol={token0?.symbol ?? ''}
                  />
                ) : transactionState === TransactionState.PROCESSING ? (
                  'Processing'
                ) : (
                  'Done'
                )}
              </Button>
            ) : (
              <Button
                size={ButtonSize.LARGE}
                color={ButtonColor.TRANSPARENT}
                bordered
                rounded={Rounding.ALL}
                grow
              >
                Enter an {token0?.symbol} amount to {operation}
              </Button>
            )}
          </div>

          {error !== null && <ErrorDisplay error={error} setError={setError} />}

          <style jsx>{`
            div {
              display: flex;
              padding: 1.1rem 1.2rem;
              --bordercolor: var(--toggleWrapperGradient);
            }
            .noBottomMargin {
              padding-bottom: 0;
            }
            section.inputWrapper {
              position: relative;
              display: flex;
              width: 100%;
              flex-direction: column;
              margin: 0;
              padding: 0;
              opacity: 1;
            }
            section.inputWrapper.disabled {
              pointer-events: none;
              opacity: 0.5;
            }
            .footer {
              box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.08);
            }
            .modalMain {
              overflow-y: scroll;
              max-height: var(--modal-maxheight);
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .modalMain::-webkit-scrollbar {
              display: none;
            }
            .row {
              position: relative;
              width: 100%;
              flex-direction: row;
              justify-content: space-between;
            }
            .buttonContent {
              font-family: inherit;
              font-size: inherit;
              font-weight: inherit;
              position: relative;
              height: 100%;
              width: 100%;
              white-space: nowrap;
              overflow-x: hidden;
              overflow-y: visible;
              text-overflow: ellipsis;
            }
          `}</style>
        </Column>
      </section>
    </Suspense>
  )
}

export default PrepareView
