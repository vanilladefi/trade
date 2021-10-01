import {
  ButtonColor,
  ButtonSize,
  ButtonState,
  Rounding,
} from 'components/input/Button'
import useTradeEngine, { TransactionState } from 'hooks/useTradeEngine'
import useVanillaRouter from 'hooks/useVanillaRouter'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, Suspense, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { token0Amount, token1Amount } from 'state/trade'
import { modalCloseEnabledState } from 'state/ui'
import { PrerenderProps } from 'types/content'
import { VanillaVersion } from 'types/general'
import { Operation } from 'types/trade'

const Button = dynamic(import('components/input/Button'))
const Column = dynamic(import('components/grid/Flex').then((mod) => mod.Column))
const Dots = dynamic(import('components/Spinner').then((mod) => mod.Dots))
const ErrorDisplay = dynamic(import('components/Trade/Modal/ErrorDisplay'))
const OperationToggle = dynamic(
  import('components/Trade/Modal/OperationToggle'),
)
const TradeInfoDisplay = dynamic(
  import('components/Trade/Modal/TradeInfoDisplay'),
)
const TokenInput = dynamic(import('components/Trade/Modal/TokenInput'))

type ContentProps = PrerenderProps & {
  operation: Operation
  setOperation: Dispatch<SetStateAction<Operation>>
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
}: ButtonAmountDisplayProps) => (
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

const PrepareView: React.FC<ContentProps> = ({
  operation,
  setOperation,
  ...rest
}: ContentProps) => {
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
    getBalance0Raw,
  } = useTradeEngine(VanillaVersion.V1_1, { ...rest })

  const amount0 = useRecoilValue(token0Amount)
  const amount1 = useRecoilValue(token1Amount)

  const setModalCloseEnabled = useSetRecoilState(modalCloseEnabledState)

  // Vanilla router contract
  const vanillaRouter = useVanillaRouter(VanillaVersion.V1_1)

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
                sellDisabled={getBalance0Raw().isZero()}
              />
            </div>

            <section className='modalMain'>
              <div className='row noBottomMargin'>
                <TokenInput version={VanillaVersion.V1_1} {...rest} />
              </div>

              {amount0 && trade?.executionPrice && vanillaRouter && (
                <div className='row'>
                  <TradeInfoDisplay version={VanillaVersion.V1_1} />
                </div>
              )}
            </section>
          </section>

          <div className='row footer'>
            {amount0 !== '0' ? (
              <Button
                onClick={async () => {
                  const hash = await executeTrade()
                  if (hash) {
                    // Wait for a bit, and then redirect the user to the TradeFlower view with more trade info
                    setTimeout(() => {
                      setTransactionState(TransactionState.PREPARE)
                      router.push(`/trade?id=${hash}`, undefined, {
                        shallow: true,
                      })
                    }, 1500)
                  }
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
                {amount1 === null ? (
                  <Dots />
                ) : notEnoughLiquidity() ? (
                  'Not enough liquidity'
                ) : notEnoughFunds() ? (
                  'Not enough funds'
                ) : transactionState === TransactionState.PREPARE ? (
                  <ButtonAmountDisplay
                    operationText={`${
                      operation.charAt(0).toUpperCase() + operation.slice(1)
                    }ing`}
                    tokenAmount={amount0 || '0.0'}
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
