// import { Token } from '@uniswap/sdk'
import { TopGradient } from 'components/backgrounds/gradient'
import { Column, Row, Width } from 'components/grid/Flex'
import Button from 'components/input/Button'
import Layout from 'components/Layout'
import { Spinner } from 'components/Spinner'
import TokenSearch from 'components/TokenSearch'
import { AvailableTokens, MyPositions } from 'components/Trade'
import HugeMonospace from 'components/typography/HugeMonospace'
import { Title } from 'components/typography/Titles'
import Wrapper from 'components/Wrapper'
import useMetaSubscription from 'hooks/useMetaSubscription'
import useTokenSubscription from 'hooks/useTokenSubscription'
import useTotalOwned from 'hooks/useTotalOwned'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import { getAverageBlockCountPerHour, getCurrentBlockNumber } from 'lib/block'
import {
  addGraphInfo,
  addLogoColor,
  addUSDPrice,
  addVnlEligibility,
  getAllTokens,
  getETHPrice,
} from 'lib/tokens'
import type { GetStaticPropsResult } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { currentETHPrice } from 'state/meta'
import {
  allTokensStoreState,
  hodlModeState,
  userTokensState,
} from 'state/tokens'
import { selectedOperation, selectedPairIdState } from 'state/trade'
import { walletModalOpenState } from 'state/wallet'
import { HandleBuyClick, HandleSellClick, Operation, Token } from 'types/trade'
import { useWallet } from 'use-wallet'

type PageProps = {
  allTokens: Token[]
  ethPrice: number
}

type BodyProps = {
  initialTokens: Token[]
  ethPrice: number
  setModalOpen: Dispatch<SetStateAction<boolean>>
}

const TradeModal = dynamic(() => import('components/Trade/Modal'), {
  ssr: false,
})

const HeaderContent = (): JSX.Element => {
  const wallet = useWallet()
  const setWalletModalOpen = useSetRecoilState(walletModalOpenState)
  const { USD: totalOwnedUSD, ETH: totalOwnedETH } = useTotalOwned()
  const userTokens = useRecoilValue(userTokensState)
  const { price } = useVanillaGovernanceToken()
  const ethPrice = useRecoilValue(currentETHPrice)

  const totalUnrealizedVnl = useCallback(() => {
    const vnlAmounts = userTokens ? userTokens.map((token) => token.vnl) : null
    return vnlAmounts
      ? vnlAmounts.reduce((accumulator, current) => {
          if (
            accumulator !== undefined &&
            current !== undefined &&
            accumulator !== null &&
            current !== null
          ) {
            return accumulator + current
          } else {
            return 0
          }
        })
      : 0
  }, [userTokens])

  const unrealizedVnlInUsd = useCallback(() => {
    const unrealizedVnl = totalUnrealizedVnl()
    if (unrealizedVnl) {
      return unrealizedVnl * parseFloat(price) * ethPrice
    } else {
      return 0
    }
  }, [ethPrice, price, totalUnrealizedVnl])

  return (
    <>
      <TopGradient />
      <Row className='subpageHeader'>
        {wallet.status === 'connected' && !userTokens && (
          <Column width={Width.TWELVE}>
            <div className='spinnerWrapper'>
              <Spinner />
            </div>
          </Column>
        )}
        {(wallet.status === 'disconnected' ||
          (userTokens && userTokens.length === 0)) && (
          <Column width={Width.EIGHT}>
            <Title>Start Trading</Title>
            <HugeMonospace>
              Buy a token below to start #ProfitMining.
            </HugeMonospace>
            <div className='buttonWrapper'>
              {wallet.status !== 'connected' && (
                <Button
                  onClick={() => {
                    setWalletModalOpen(true)
                  }}
                >
                  Connect wallet
                </Button>
              )}
              <Link href='/faq'>
                <Button>Learn more</Button>
              </Link>
            </div>
          </Column>
        )}
        {userTokens && userTokens.length > 0 && (
          <Column width={Width.TWELVE}>
            <Title>My trading</Title>
            <div className='stats-grid'>
              <div className='stats-grid-item'>
                <h2 className='title'>MY POSITIONS</h2>
                <h3 className='subTitle'>${totalOwnedUSD.toLocaleString()}</h3>
                <span className='details'>
                  {totalOwnedETH.toLocaleString()} ETH
                </span>
              </div>
              <div className='stats-grid-item'>
                <h2 className='title'>UNREALIZED VNL</h2>
                <h3 className='subTitle'>
                  {totalUnrealizedVnl()?.toLocaleString()} VNL
                  <small> ${unrealizedVnlInUsd().toLocaleString()}</small>
                </h3>
                <span className='details'>
                  from {userTokens.length} positions
                </span>
              </div>
            </div>
          </Column>
        )}
      </Row>
      <style jsx>{`
        .spinnerWrapper {
          width: 100%;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          --iconsize: 2rem;
        }
      `}</style>
      <style jsx global>{`
        .subpageHeader {
          --buttonmargin: var(--subpage-buttonmargin);
          --titlemargin: var(--subpage-titlemargin);
        }

        .stats-grid {
          width: 100%;
          display: grid;
          gap: 70px;
          grid: auto / 1fr 1fr;
          margin-bottom: 2rem;
          margin-top: 2rem;
        }
        .stats-grid .title,
        .stats-grid .subTitle,
        .stats-grid .details {
          font-size: 1.1rem;
          font-family: var(--monofont);
          font-weight: var(--monoweight)
          line-height: 1em;
          margin: 0;
          padding: 0;
        }

        .stats-grid-item {
          width: 100%;
          display: grid;
          grid:
            "title" auto
            "subTitle" auto
            "details" 26px
            / auto
        }

        .stats-grid .title {
          grid-area: title;
          font-weight: var(--titleweight);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(44, 25, 41, .4)
        }

        .stats-grid .subTitle {
          grid-area: subTitle;
          font-size: 1.8rem;
        }

        .stats-grid .details {
          grid-area: details;
        }

        .buttonWrapper {
          display: flex;
          flex-direction: row;
        }

        @media(max-width: 680px){
          .stats-grid {
            gap: 0;
            grid: auto / auto;
          }
          .stats-grid-item:first-child {
            border-top: 1px solid rgba(44, 25, 41, .4);
          }
          .stats-grid-item {
            grid:
              "title subTitle" 1fr
              "title details" auto
              / 1fr 1fr;
            padding: 2rem 0;
            border-bottom: 1px solid rgba(44, 25, 41, .4);
          }
          .stats-grid .title {
            align-self: center;
            font-size: 1.5rem;
            padding-bottom: 0;
            margin-bottom: 0;
            border: none;
          }
          .stats-grid .subTitle,
          .stats-grid .details {
            align-self: center;
            justify-self: end;
            text-align: right;
          }
          .stats-grid .subTitle {
            font-size: 2.2rem;
          }
          .stats-grid .details {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  )
}

const BodyContent = ({
  initialTokens,
  ethPrice,
  setModalOpen,
}: BodyProps): JSX.Element => {
  useMetaSubscription()
  useTokenSubscription()

  const setETHPrice = useSetRecoilState(currentETHPrice)
  const setTokens = useSetRecoilState(allTokensStoreState)
  const setSelectedPairId = useSetRecoilState(selectedPairIdState)
  const setWalletModalOpen = useSetRecoilState(walletModalOpenState)
  const setOperation = useSetRecoilState(selectedOperation)
  const [hodlMode, setHodlMode] = useRecoilState(hodlModeState)
  const userPositions = useRecoilValue(userTokensState)
  const { account } = useWallet()

  useEffect(() => {
    setTokens(initialTokens)
    setETHPrice(ethPrice)
  }, [setTokens, initialTokens, setETHPrice, ethPrice])

  const profitablePositions = useCallback(() => {
    return userPositions?.filter((token) => token.profit && token.profit > 0)
      .length
  }, [userPositions])

  const handleBuyClick: HandleBuyClick = useCallback(
    (pairInfo) => {
      if (account === null) {
        setWalletModalOpen(true)
      } else {
        setWalletModalOpen(false)
        setOperation(Operation.Buy)
        setSelectedPairId(pairInfo?.pairId ?? null)
        setModalOpen(true)
      }
    },
    [
      account,
      setModalOpen,
      setOperation,
      setSelectedPairId,
      setWalletModalOpen,
    ],
  )

  const handleSellClick: HandleSellClick = useCallback(
    (pairInfo) => {
      if (account === null) {
        setWalletModalOpen(true)
      } else {
        setWalletModalOpen(false)
        setOperation(Operation.Sell)
        setSelectedPairId(pairInfo?.pairId ?? null)
        setModalOpen(true)
      }
    },
    [
      account,
      setModalOpen,
      setOperation,
      setSelectedPairId,
      setWalletModalOpen,
    ],
  )

  return (
    <>
      <div className='token-search'>
        <div className='token-search-container'>
          <TokenSearch placeholder='Search tokens by name or ticker' />
        </div>
      </div>
      <Wrapper>
        <Row>
          <Column width={Width.TWELVE}>
            {account && (
              <>
                <div className='tableHeaderWrapper'>
                  <h2 style={{ marginBottom: 0 }}>
                    MY POSITIONS
                    {userPositions && userPositions.length > 0 && (
                      <small>{`${profitablePositions()} of ${
                        userPositions ? userPositions.length : 0
                      } profitable`}</small>
                    )}
                  </h2>
                  <div className='hodlWrapper'>
                    <span>ADVANCED HODL MODE</span>
                    <button
                      className={`hodlToggle${hodlMode ? ' active' : ''}`}
                      onClick={() => setHodlMode(!hodlMode)}
                    >
                      <div className='handle'></div>
                    </button>
                  </div>
                </div>
                <MyPositions
                  onBuyClick={handleBuyClick}
                  onSellClick={handleSellClick}
                />
              </>
            )}

            <h2 style={{ marginBottom: 0 }}>AVAILABLE TOKENS</h2>
            {/* Pass "initialTokens" so this page is statically rendered with tokens */}
            <AvailableTokens
              initialTokens={initialTokens}
              onBuyClick={handleBuyClick}
            />
          </Column>
        </Row>
      </Wrapper>
      <style jsx>{`
        h2 small {
          margin-left: 1rem;
          font-weight: 400;
          font-family: var(--bodyfont);
          font-size: 1rem;
        }
        .token-search {
          padding: 0.7rem 1rem;
          width: 100%;
          border-bottom: 2px solid #f2f0e9;
        }
        .token-search-container {
          width: 100%;
          max-width: var(--maxlayoutwidth);
          margin: 0 auto;
        }
        .tableHeaderWrapper {
          display: flex;
          position: relative;
          width: 100%;
          flex-direction: row;
          align-items: flex-end;
          justify-content: space-between;
        }
        .hodlWrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .hodlWrapper span {
          font-size: var(--minisize);
          font-weight: var(--buttonweight);
          margin-right: 0.4rem;
        }
        .hodlToggle {
          cursor: pointer;
          height: 28px;
          width: 60px;
          background: var(--inactivelink);
          border-radius: 9999px;
          position: relative;
          display: flex;
          border: 2px solid var(--bordercolor);
          outline: 0;
          padding: 2px;
          transition: 0.2s ease background;
        }
        .hodlToggle.active {
          background: var(--buttongradient);
        }
        .hodlToggle .handle {
          display: flex;
          position: relative;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--white);
          margin-left: 0;
          transition: 0.2s ease margin-left;
        }
        .hodlToggle.active .handle {
          margin-left: calc(100% - 20px);
        }
      `}</style>
    </>
  )
}

export default function TradePage({
  allTokens,
  ethPrice,
}: PageProps): JSX.Element {
  // NOTE: allTokens here will be stale after a while
  // allTokens here is only used to populate the state on first render (static)
  // Updates to allTokens happen in recoil
  // Recoil can not be used here as this is outside of recoilRoot
  // because this is a page component

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Layout
      title='Start trading'
      description='Make trades, see your profits blossom and mine VNL.'
      shareImg='/social/social-share-trade.png'
      heroRenderer={HeaderContent}
    >
      <TradeModal
        open={modalOpen}
        onRequestClose={() => {
          setModalOpen(false)
        }}
      />
      <BodyContent
        initialTokens={allTokens}
        ethPrice={ethPrice}
        setModalOpen={setModalOpen}
      />
    </Layout>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  let tokens = getAllTokens()
  tokens = await addLogoColor(tokens)

  // Fetch these simultaneously
  const [blocksPerHour, currentBlockNumber, ethPrice] = await Promise.all([
    getAverageBlockCountPerHour(),
    getCurrentBlockNumber(),
    getETHPrice(),
  ])

  tokens = await addGraphInfo(tokens)
  tokens = addUSDPrice(tokens, ethPrice)
  tokens = await addVnlEligibility(tokens)

  const block24hAgo = currentBlockNumber - 24 * blocksPerHour

  // Add historical data (price change)
  if (block24hAgo > 0) {
    tokens = await addGraphInfo(tokens, block24hAgo, ethPrice)
  }

  return {
    props: {
      allTokens: tokens,
      ethPrice: ethPrice || 0,
    },
    revalidate: 60,
  }
}
