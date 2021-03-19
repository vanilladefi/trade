// import { Token } from '@uniswap/sdk'
import { TopGradient } from 'components/backgrounds/gradient'
import { Column, Row, Width } from 'components/grid/Flex'
import Button, { ButtonSize } from 'components/input/Button'
import Layout from 'components/Layout'
import { Spinner } from 'components/Spinner'
import TokenSearch from 'components/TokenSearch'
import { AvailableTokens, MyPositions } from 'components/Trade'
import HugeMonospace from 'components/typography/HugeMonospace'
import { Title } from 'components/typography/Titles'
import Wrapper from 'components/Wrapper'
import useMetaSubscription from 'hooks/useMetaSubscription'
import useTokenSubscription from 'hooks/useTokenSubscription'
import useTotalOwnedUSD from 'hooks/useTotalOwnedUSD'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import { getAverageBlockCountPerHour, getCurrentBlockNumber } from 'lib/block'
import {
  addGraphInfo,
  addLogoColor,
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
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentETHPrice } from 'state/meta'
import { allTokensStoreState, userTokensState } from 'state/tokens'
import { selectedPairIdState } from 'state/trade'
import { walletModalOpenState } from 'state/wallet'
import type { HandleBuyClick, HandleSellClick, Token } from 'types/trade'
import { useWallet } from 'use-wallet'

type PageProps = {
  allTokens: Token[]
  ethPrice: string
}

type BodyProps = {
  initialTokens: Token[]
  ethPrice: string
  setModalOpen: Dispatch<SetStateAction<boolean>>
}

const TradeModal = dynamic(() => import('components/Trade/Modal'), {
  ssr: false,
})

const HeaderContent = (): JSX.Element => {
  const wallet = useWallet()
  const setWalletModalOpen = useSetRecoilState(walletModalOpenState)
  const { balance: vnlBalance, userMintedTotal } = useVanillaGovernanceToken()
  const totalOwnedUSD = useTotalOwnedUSD()
  const userTokens = useRecoilValue(userTokensState)

  const totalUnrealizedProfit = useCallback(() => {
    const profits = userTokens
      ? userTokens.map((token) =>
          token.value && token.profit && token.value > 0
            ? parseFloat(token.profit) / token.value
            : 0,
        )
      : null
    return profits ? profits.reduce((a, b) => a + b).toFixed(2) : null
  }, [userTokens])

  const totalUnrealizedVnl = useCallback(() => {
    const vnlAmounts = userTokens ? userTokens.map((token) => token.vnl) : null
    return vnlAmounts
      ? vnlAmounts.reduce((accumulator, current) => {
          if (accumulator && current) {
            return accumulator + current
          } else if (current) {
            return current
          } else {
            return 0
          }
        })
      : 0
  }, [userTokens])

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
              Buy a token below to start #ProfitMining. When you sell the token
              through Vanilla later and you make a profit in ETH, you mine some
              VNL tokens.
            </HugeMonospace>
            <div className='buttonWrapper'>
              {wallet.status !== 'connected' && (
                <Button
                  size={ButtonSize.LARGE}
                  onClick={() => {
                    setWalletModalOpen(true)
                  }}
                >
                  Connect wallet
                </Button>
              )}
              <Link href='/faq'>
                <Button size={ButtonSize.LARGE}>Learn more</Button>
              </Link>
            </div>
          </Column>
        )}
        {userTokens && userTokens.length > 0 && (
          <Column width={Width.TWELVE}>
            <Title>My trading</Title>
            <div className='stats-grid'>
              <div className='stats-grid-item'>
                <h2 className='title'>TOTAL BALANCE</h2>
                <h3 className='subTitle'>${totalOwnedUSD.toLocaleString()}</h3>
                <span className='details'>{vnlBalance} VNL</span>
              </div>
              <div className='stats-grid-item'>
                <h2 className='title'>VNL MINED</h2>
                <h3 className='subTitle'>{userMintedTotal} VNL</h3>
              </div>
              <div className='stats-grid-item'>
                <h2 className='title'>UNREALIZED PROFIT</h2>
                <h3 className='subTitle'>
                  {totalUnrealizedProfit() ? (
                    `${totalUnrealizedProfit()} %`
                  ) : (
                    <Spinner />
                  )}
                </h3>
                <span className='details'>{totalUnrealizedVnl()} VNL</span>
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
          grid: auto / 1fr 1fr 1fr;
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
  const { account } = useWallet()

  useEffect(() => {
    setTokens(initialTokens)
    setETHPrice(ethPrice)
  }, [setTokens, initialTokens, setETHPrice, ethPrice])

  const handleBuyClick: HandleBuyClick = useCallback(
    (pairInfo) => {
      if (account === null) {
        setWalletModalOpen(true)
      } else {
        setWalletModalOpen(false)
        setSelectedPairId(pairInfo?.pairId ?? null)
        setModalOpen(true)
      }
    },
    [account, setModalOpen, setSelectedPairId, setWalletModalOpen],
  )

  const handleSellClick: HandleSellClick = useCallback(
    (pairInfo) => {
      if (account === null) {
        setWalletModalOpen(true)
      } else {
        setWalletModalOpen(false)
        setSelectedPairId(pairInfo?.pairId ?? null)
        setModalOpen(true)
      }
    },
    [account, setModalOpen, setSelectedPairId, setWalletModalOpen],
  )

  return (
    <Wrapper>
      <Row>
        <Column width={Width.TWELVE}>
          <div className='token-search'>
            <TokenSearch placeholder='Search tokens by name or ticker' />
          </div>

          {account && (
            <>
              <h2>MY POSITIONS</h2>
              <MyPositions
                onBuyClick={handleBuyClick}
                onSellClick={handleSellClick}
              />
            </>
          )}

          <h2>AVAILABLE TOKENS</h2>
          {/* Pass "initialTokens" so this page is statically rendered with tokens */}
          <AvailableTokens
            initialTokens={initialTokens}
            onBuyClick={handleBuyClick}
          />
        </Column>
      </Row>
      <style jsx>{`
        .token-search {
          width: calc(100% + 2 * var(--outermargin));
          margin-left: calc(-1 * var(--outermargin));
          padding: 0.7rem 1rem;
          border-bottom: 2px solid #f2f0e9;
        }
      `}</style>
    </Wrapper>
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
  const [
    blocksPerHour,
    currentBlockNumber,
    ethPrice,
    _tokens,
  ] = await Promise.all([
    getAverageBlockCountPerHour(),
    getCurrentBlockNumber(),
    getETHPrice(),
    addGraphInfo(tokens),
  ])

  const block24hAgo = currentBlockNumber - 24 * blocksPerHour

  // Add historical data (price change)
  if (block24hAgo > 0) {
    tokens = await addGraphInfo(_tokens, block24hAgo)
  } else {
    tokens = _tokens
  }

  return {
    props: {
      allTokens: tokens,
      ethPrice: ethPrice || '0',
    },
    revalidate: 60,
  }
}
