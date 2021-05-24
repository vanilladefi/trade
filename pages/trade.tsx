import { TopGradient } from 'components/backgrounds/gradient'
import { Column, Row, Width } from 'components/grid/Flex'
import Button from 'components/input/Button'
import Layout from 'components/Layout'
import { Spinner } from 'components/Spinner'
import TokenSearch from 'components/TokenSearch'
import { AvailableTokens, MyPositionsV2, MyPositionsV3 } from 'components/Trade'
import HugeMonospace from 'components/typography/HugeMonospace'
import { Title } from 'components/typography/Titles'
import Wrapper from 'components/Wrapper'
import useMetaSubscription from 'hooks/useMetaSubscription'
import useTokenSubscription from 'hooks/useTokenSubscription'
import useTotalOwned from 'hooks/useTotalOwned'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import { getAverageBlockCountPerHour, getCurrentBlockNumber } from 'lib/block'
import { UniswapVersion } from 'lib/graphql'
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
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentBlockNumberState, currentETHPrice } from 'state/meta'
import {
  uniswapV2TokenState,
  uniswapV3TokenState,
  userTokensState,
} from 'state/tokens'
import { selectedOperation, selectedPairIdState } from 'state/trade'
import { walletModalOpenState } from 'state/wallet'
import { HandleBuyClick, HandleSellClick, Operation, Token } from 'types/trade'
import { useWallet } from 'use-wallet'

type PageProps = {
  uniswapV2Tokens: Token[]
  uniswapV3Tokens: Token[]
  ethPrice: number
  currentBlockNumber: number
}

type BodyProps = {
  initialTokens: { v2: Token[]; v3: Token[] }
  ethPrice: number
  currentBlockNumber: number
  setModalOpen: (exchange: UniswapVersion) => void
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
                <h3 className='subTitle'>
                  ${totalOwnedUSD.toLocaleString('en-US')}
                </h3>
                <span className='details'>
                  {totalOwnedETH.toLocaleString('en-US')} ETH
                </span>
              </div>
              <div className='stats-grid-item'>
                <h2 className='title'>UNREALIZED VNL</h2>
                <h3 className='subTitle'>
                  {totalUnrealizedVnl()?.toLocaleString('en-US')} VNL
                </h3>
                <span className='details'>
                  ${unrealizedVnlInUsd().toLocaleString('en-US')}
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
  currentBlockNumber,
  setModalOpen,
}: BodyProps): JSX.Element => {
  useMetaSubscription()
  useTokenSubscription(UniswapVersion.v2)
  useTokenSubscription(UniswapVersion.v3)

  const setETHPrice = useSetRecoilState(currentETHPrice)
  const setV2Tokens = useSetRecoilState(uniswapV2TokenState)
  const setV3Tokens = useSetRecoilState(uniswapV3TokenState)
  const setCurrentBlockNumber = useSetRecoilState(currentBlockNumberState)
  const setSelectedPairId = useSetRecoilState(selectedPairIdState)
  const setWalletModalOpen = useSetRecoilState(walletModalOpenState)
  const setOperation = useSetRecoilState(selectedOperation)
  const userPositions = useRecoilValue(userTokensState)
  const { account } = useWallet()

  useEffect(() => {
    setV2Tokens(initialTokens.v2)
    setV3Tokens(initialTokens.v3)
    setETHPrice(ethPrice)
    setCurrentBlockNumber(currentBlockNumber)
  }, [
    initialTokens,
    setETHPrice,
    ethPrice,
    setCurrentBlockNumber,
    currentBlockNumber,
    setV2Tokens,
    setV3Tokens,
  ])

  const profitablePositions = useCallback(() => {
    return userPositions?.filter((token) => token.profit && token.profit > 0)
      .length
  }, [userPositions])

  const handleV2BuyClick: HandleBuyClick = useCallback(
    (pairInfo) => {
      if (account === null) {
        setWalletModalOpen(true)
      } else {
        setWalletModalOpen(false)
        setOperation(Operation.Buy)
        setSelectedPairId(pairInfo?.pairId ?? null)
        setModalOpen(UniswapVersion.v2)
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

  const handleV2SellClick: HandleSellClick = useCallback(
    (pairInfo) => {
      if (account === null) {
        setWalletModalOpen(true)
      } else {
        setWalletModalOpen(false)
        setOperation(Operation.Sell)
        setSelectedPairId(pairInfo?.pairId ?? null)
        setModalOpen(UniswapVersion.v2)
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

  const handleV3BuyClick: HandleBuyClick = useCallback(
    (pairInfo) => {
      if (account === null) {
        setWalletModalOpen(true)
      } else {
        setWalletModalOpen(false)
        setOperation(Operation.Buy)
        setSelectedPairId(pairInfo?.pairId ?? null)
        setModalOpen(UniswapVersion.v3)
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

  const handleV3SellClick: HandleSellClick = useCallback(
    (pairInfo) => {
      if (account === null) {
        setWalletModalOpen(true)
      } else {
        setWalletModalOpen(false)
        setOperation(Operation.Sell)
        setSelectedPairId(pairInfo?.pairId ?? null)
        setModalOpen(UniswapVersion.v3)
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
                </div>
                <MyPositionsV3
                  onBuyClick={handleV3BuyClick}
                  onSellClick={handleV3SellClick}
                />
                <div className='tableHeaderWrapper'>
                  <h2 style={{ marginBottom: 0 }}>
                    MY VANILLA 1.0 POSITIONS
                    {userPositions && userPositions.length > 0 && (
                      <small>{`${profitablePositions()} of ${
                        userPositions ? userPositions.length : 0
                      } profitable`}</small>
                    )}
                  </h2>
                </div>
                <MyPositionsV2
                  onBuyClick={handleV2BuyClick}
                  onSellClick={handleV2SellClick}
                />
              </>
            )}

            <h2 style={{ marginBottom: 0 }}>AVAILABLE TOKENS</h2>
            {/* Pass "initialTokens" so this page is statically rendered with tokens */}
            <AvailableTokens
              initialTokens={initialTokens.v3}
              onBuyClick={handleV3BuyClick}
              exchange={UniswapVersion.v3}
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
      `}</style>
    </>
  )
}

export default function TradePage({
  uniswapV2Tokens,
  uniswapV3Tokens,
  ethPrice,
  currentBlockNumber,
}: PageProps): JSX.Element {
  // NOTE: uniswapV2Tokens & uniswapV3Tokens here will be stale after a while
  // uniswapV2Tokens & uniswapV3Tokens here is only used to populate the state on first render (static)
  // Updates to uniswapV2Tokens & uniswapV3Tokens happen in recoil
  // Recoil can not be used here as this is outside of recoilRoot
  // because this is a page component

  const [activeExchange, setActiveExchange] = useState<UniswapVersion>(
    UniswapVersion.v3,
  )
  const [modalOpen, setModalOpen] = useState(false)

  const toggleModalOpen = (exchange: UniswapVersion) => {
    setActiveExchange(exchange)
    setModalOpen(!modalOpen)
  }

  return (
    <Layout
      title='Start trading'
      description='Make trades, see your profits blossom and mine VNL.'
      shareImg='/social/social-share-trade.png'
      heroRenderer={HeaderContent}
    >
      <TradeModal
        open={modalOpen}
        uniswapVersion={activeExchange}
        onRequestClose={() => {
          toggleModalOpen(activeExchange)
        }}
      />
      <BodyContent
        initialTokens={{ v2: uniswapV2Tokens, v3: uniswapV3Tokens }}
        ethPrice={ethPrice}
        setModalOpen={toggleModalOpen}
        currentBlockNumber={currentBlockNumber}
      />
    </Layout>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  // Fetch Uniswap V2 token info
  let tokensV2 = getAllTokens()
  tokensV2 = await addLogoColor(tokensV2)

  // Fetch these simultaneously
  const [
    blocksPerHourV2,
    currentBlockNumberV2,
    ethPriceV2,
  ] = await Promise.all([
    getAverageBlockCountPerHour(),
    getCurrentBlockNumber(UniswapVersion.v2),
    getETHPrice(UniswapVersion.v2),
  ])

  if (ethPriceV2 === 0 || currentBlockNumberV2 === 0 || blocksPerHourV2 === 0) {
    throw Error('Query failed')
  }

  let block24hAgo = currentBlockNumberV2 - 24 * blocksPerHourV2

  tokensV2 = await addGraphInfo(UniswapVersion.v2, tokensV2)
  tokensV2 = addUSDPrice(tokensV2, ethPriceV2)
  tokensV2 = await addVnlEligibility(tokensV2)

  // Add historical data (price change)
  if (block24hAgo > 0) {
    tokensV2 = await addGraphInfo(
      UniswapVersion.v2,
      tokensV2,
      block24hAgo,
      ethPriceV2,
    )
  }

  // Fetch Uniswap V3 token info
  let tokensV3 = getAllTokens()
  tokensV3 = await addLogoColor(tokensV3)

  // Fetch these simultaneously
  const [
    blocksPerHourV3,
    currentBlockNumberV3,
    ethPriceV3,
  ] = await Promise.all([
    getAverageBlockCountPerHour(),
    getCurrentBlockNumber(UniswapVersion.v3),
    getETHPrice(UniswapVersion.v3),
  ])

  if (ethPriceV3 === 0 || currentBlockNumberV3 === 0 || blocksPerHourV3 === 0) {
    throw Error('Query failed')
  }

  tokensV3 = await addGraphInfo(UniswapVersion.v3, tokensV3)
  tokensV3 = addUSDPrice(tokensV3, ethPriceV3)
  tokensV3 = await addVnlEligibility(tokensV3)

  block24hAgo = currentBlockNumberV3 - 24 * blocksPerHourV3

  // Add historical data (price change)
  if (block24hAgo > 0) {
    tokensV3 = await addGraphInfo(
      UniswapVersion.v3,
      tokensV3,
      block24hAgo,
      ethPriceV3,
    )
  }

  return {
    props: {
      uniswapV2Tokens: tokensV2,
      uniswapV3Tokens: tokensV3,
      ethPrice: ethPriceV3 || ethPriceV2 || 0,
      currentBlockNumber: currentBlockNumberV3 || currentBlockNumberV2,
    },
    revalidate: 60,
  }
}
