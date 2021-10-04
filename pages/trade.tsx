import { TopGradient } from 'components/backgrounds/gradient'
import { Column, Row, Width } from 'components/grid/Flex'
import Button from 'components/input/Button'
import Layout from 'components/Layout'
import SyncIndicator from 'components/SyncIndicator'
import TokenConversion from 'components/TokenConversion'
import TokenSearch from 'components/TokenSearch'
import { AvailableTokens, MyPositionsV2, MyPositionsV3 } from 'components/Trade'
import HugeMonospace from 'components/typography/HugeMonospace'
import { Title } from 'components/typography/Titles'
import Wrapper from 'components/Wrapper'
import useMetaSubscription from 'hooks/useMetaSubscription'
import useTokenSubscription from 'hooks/useTokenSubscription'
import useTotalOwned from 'hooks/useTotalOwned'
import useUserPositions from 'hooks/useUserPositions'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import useWalletAddress from 'hooks/useWalletAddress'
import type { GetStaticProps, GetStaticPropsResult } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentBlockNumberState, currentETHPrice } from 'state/meta'
import {
  uniswapV2TokenState,
  uniswapV3TokenState,
  userV2TokensState,
  userV3TokensState,
} from 'state/tokens'
import {
  selectedExchange,
  selectedOperation,
  selectedPairIdState,
} from 'state/trade'
import { walletModalOpenState } from 'state/wallet'
import { BodyProps, PrerenderProps } from 'types/content'
import { UniswapVersion, VanillaVersion } from 'types/general'
import { HandleBuyClick, HandleSellClick, Operation } from 'types/trade'
import { useWallet } from 'use-wallet'
import { getCachedBlockNumber, getCachedEthPrice } from 'utils/cache/meta'
import { getCachedV2Tokens, getCachedV3Tokens } from 'utils/cache/tokens'

const TradeModal = dynamic(() => import('components/Trade/Modal'))

const HeaderContent = ({ initialTokens }: PrerenderProps): JSX.Element => {
  const wallet = useWallet()

  const setWalletModalOpen = useSetRecoilState(walletModalOpenState)
  const { USD: totalOwnedUSD, ETH: totalOwnedETH } = useTotalOwned({
    initialTokens: initialTokens,
  })
  const { price } = useVanillaGovernanceToken(VanillaVersion.V1_0)

  const userV2Tokens = useRecoilValue(userV2TokensState)
  const userV3Tokens = useRecoilValue(userV3TokensState)
  const ethPrice = useRecoilValue(currentETHPrice)

  const getUserTokens = useCallback(() => {
    const v2Tokens =
      userV2Tokens?.length > 0
        ? userV2Tokens
        : initialTokens?.userPositionsV2 || []
    const v3Tokens =
      userV3Tokens?.length > 0
        ? userV3Tokens
        : initialTokens?.userPositionsV3 || []
    return [...v2Tokens, ...v3Tokens]
  }, [initialTokens, userV2Tokens, userV3Tokens])

  const totalUnrealizedVnl = useCallback(() => {
    return getUserTokens()
      .map((token) => token.vnl)
      .reduce((accumulator, current) => {
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
      }, 0)
  }, [getUserTokens])

  const unrealizedVnlInUsd = useCallback(() => {
    return totalUnrealizedVnl() * parseFloat(price) * ethPrice
  }, [ethPrice, price, totalUnrealizedVnl])

  return (
    <>
      <TopGradient />
      <TokenConversion />
      <Wrapper>
        <Row className='subpageHeader'>
          {getUserTokens().length === 0 ? (
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
                <Link href='/faq' passHref>
                  <Button>Learn more</Button>
                </Link>
              </div>
            </Column>
          ) : (
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
      </Wrapper>
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
          padding: var(--headerpadding);
          padding-top: 0;
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
  walletAddress,
  initialTokens,
  ethPrice,
  currentBlockNumber,
  setModalOpen,
  activeExchange,
}: BodyProps): JSX.Element => {
  // Initialize subscriptions to needed TheGraph data. Only use these hooks once per page.
  useMetaSubscription(VanillaVersion.V1_1)
  useTokenSubscription(VanillaVersion.V1_0)
  useTokenSubscription(VanillaVersion.V1_1)

  const { long: account } = useWalletAddress()

  const setETHPrice = useSetRecoilState(currentETHPrice)
  const setV2Tokens = useSetRecoilState(uniswapV2TokenState)
  const setV3Tokens = useSetRecoilState(uniswapV3TokenState)
  const setV2UserTokens = useSetRecoilState(userV2TokensState)
  const setV3UserTokens = useSetRecoilState(userV3TokensState)
  const setCurrentBlockNumber = useSetRecoilState(currentBlockNumberState)
  const setSelectedPairId = useSetRecoilState(selectedPairIdState)
  const setWalletModalOpen = useSetRecoilState(walletModalOpenState)
  const setOperation = useSetRecoilState(selectedOperation)
  const setExchange = useSetRecoilState(selectedExchange)

  const userPositionsV3 = useUserPositions(
    VanillaVersion.V1_1,
    walletAddress || account,
  )
  const userPositionsV2 = useUserPositions(
    VanillaVersion.V1_0,
    walletAddress || account,
  )

  useEffect(() => {
    setExchange(activeExchange)
    setV2Tokens(initialTokens?.v2 || [])
    setV3Tokens(initialTokens?.v3 || [])
    setV2UserTokens(initialTokens?.userPositionsV2 || [])
    setV3UserTokens(initialTokens?.userPositionsV3 || [])
    setETHPrice(ethPrice)
    setCurrentBlockNumber(currentBlockNumber)
  }, [
    initialTokens?.v2,
    initialTokens?.v3,
    initialTokens?.userPositionsV2,
    initialTokens?.userPositionsV3,
    setETHPrice,
    ethPrice,
    setCurrentBlockNumber,
    currentBlockNumber,
    setV2Tokens,
    setV3Tokens,
    setExchange,
    activeExchange,
    setV3UserTokens,
    setV2UserTokens,
  ])

  const profitablePositions = useCallback(() => {
    return (
      userPositionsV3?.filter((token) => token.profit && token.profit > 0)
        .length ||
      initialTokens?.userPositionsV3?.filter(
        (token) => token.profit && token.profit > 0,
      ).length ||
      0
    )
  }, [initialTokens?.userPositionsV3, userPositionsV3])

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
            <div className='tableHeaderWrapper'>
              <h2 style={{ marginBottom: 0 }}>
                MY POSITIONS
                <small>{`${profitablePositions()} of ${
                  userPositionsV3?.length > 0
                    ? userPositionsV3?.length
                    : initialTokens?.userPositionsV3?.length || 0
                } profitable`}</small>
              </h2>
            </div>
            <MyPositionsV3
              initialTokens={initialTokens}
              onBuyClick={handleV3BuyClick}
              onSellClick={handleV3SellClick}
            />
            {userPositionsV2?.length > 0 && (
              <>
                <div className='tableHeaderWrapper'>
                  <h2 style={{ marginBottom: 0 }}>MY VANILLA 1.0 POSITIONS</h2>
                </div>
                <MyPositionsV2
                  initialTokens={initialTokens}
                  onSellClick={handleV2SellClick}
                />
              </>
            )}

            <div className='tableHeaderWrapper'>
              <h2 style={{ marginBottom: 0 }}>AVAILABLE TOKENS</h2>
              <SyncIndicator />
            </div>
            <AvailableTokens
              initialTokens={initialTokens}
              onBuyClick={handleV3BuyClick}
              uniswapVersion={UniswapVersion.v3}
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

export default function TradePage(props: PrerenderProps): JSX.Element {
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
      hero={<HeaderContent {...props} />}
      {...props}
    >
      <TradeModal
        open={modalOpen}
        uniswapVersion={activeExchange}
        onRequestClose={() => {
          toggleModalOpen(activeExchange)
        }}
      />
      <BodyContent
        setModalOpen={toggleModalOpen}
        activeExchange={activeExchange}
        {...props}
      />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (): Promise<
  GetStaticPropsResult<PrerenderProps>
> => {
  const currentBlockNumber = await getCachedBlockNumber()
  const ethPrice = await getCachedEthPrice()
  const tokensV3 = await getCachedV3Tokens(currentBlockNumber, ethPrice)
  const tokensV2 = await getCachedV2Tokens(currentBlockNumber, ethPrice)
  return {
    props: {
      initialTokens: {
        v2: tokensV2,
        v3: tokensV3,
        userPositionsV2: null,
        userPositionsV3: null,
      },
      ethPrice: ethPrice,
      currentBlockNumber: currentBlockNumber,
    },
    revalidate: 300,
  }
}
