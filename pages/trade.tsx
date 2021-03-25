// import { Token } from '@uniswap/sdk'
import { TopGradient } from 'components/backgrounds/gradient'
import { Column, Row, Width } from 'components/grid/Flex'
import Button, { ButtonSize } from 'components/input/Button'
import Layout from 'components/Layout'
import TokenSearch from 'components/TokenSearch'
import { AvailableTokens, MyPositions } from 'components/Trade'
import HugeMonospace from 'components/typography/HugeMonospace'
import { Title } from 'components/typography/Titles'
import Wrapper from 'components/Wrapper'
import useAllTransactions from 'hooks/useAllTransactions'
import useMetaSubscription from 'hooks/useMetaSubscription'
import useTokenSubscription from 'hooks/useTokenSubscription'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import { getAverageBlockCountPerHour, getCurrentBlockNumber } from 'lib/block'
import { addGraphInfo, addLogoColor, getAllTokens } from 'lib/tokens'
import type { GetStaticPropsResult } from 'next'
import dynamic from 'next/dynamic'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useSetRecoilState } from 'recoil'
import { allTokensStoreState } from 'state/tokens'
import { selectedPairIdState } from 'state/trade'
import { walletModalOpenState } from 'state/wallet'
import type { HandleBuyClick, HandleSellClick, Token } from 'types/trade'
import { useWallet } from 'use-wallet'

type PageProps = {
  allTokens: Token[]
}

type BodyProps = {
  allTokens: Token[]
  setModalOpen: Dispatch<SetStateAction<boolean>>
}

const TradeModal = dynamic(() => import('components/Trade/Modal'), {
  ssr: false,
})

const HeaderContent = (): JSX.Element => {
  const wallet = useWallet()
  const setWalletModalOpen = useSetRecoilState(walletModalOpenState)
  const { balance: vnlBalance, userMintedTotal } = useVanillaGovernanceToken()

  const { transactionsByCurrentAccount } = useAllTransactions()

  return (
    <>
      <TopGradient />
      <Row className='subpageHeader'>
        {wallet.status !== 'connected' ||
        !transactionsByCurrentAccount ||
        transactionsByCurrentAccount.length === 0 ? (
          <Column width={Width.EIGHT}>
            <Title>Start Trading</Title>
            <HugeMonospace>
              Buy a token below to start #ProfitMining. When you sell the token
              through Vanilla later and you make a profit in ETH, you mine some
              VNL tokens.
            </HugeMonospace>
            <Button
              size={ButtonSize.LARGE}
              onClick={() => {
                setWalletModalOpen(true)
              }}
            >
              Connect wallet
            </Button>
          </Column>
        ) : (
          <Column width={Width.TWELVE}>
            <Title>My trading</Title>
            <div className='stats-grid'>
              <div className='stats-grid-item'>
                <h2 className='title'>TOTAL BALANCE</h2>
                <h3 className='subTitle'>$324</h3>
                <span className='details'>{vnlBalance} VNL</span>
              </div>
              <div className='stats-grid-item'>
                <h2 className='title'>VNL MINED</h2>
                <h3 className='subTitle'>{userMintedTotal} VNL</h3>
              </div>
              <div className='stats-grid-item'>
                <h2 className='title'>UNREALIZED PROFIT</h2>
                <h3 className='subTitle'>12%</h3>
                <span className='details'>1.15 VNL</span>
              </div>
            </div>
          </Column>
        )}
      </Row>
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

const BodyContent = ({ allTokens, setModalOpen }: BodyProps): JSX.Element => {
  useMetaSubscription()
  useTokenSubscription()

  const setTokens = useSetRecoilState(allTokensStoreState)
  const setSelectedPairId = useSetRecoilState(selectedPairIdState)
  const setWalletModalOpen = useSetRecoilState(walletModalOpenState)
  const { account } = useWallet()

  useEffect(() => setTokens(allTokens), [setTokens, allTokens])

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

          <h2>MY POSITIONS</h2>
          <MyPositions
            onBuyClick={handleBuyClick}
            onSellClick={handleSellClick}
          />

          <h2>AVAILABLE TOKENS</h2>
          {/* Pass "initialTokens" so this page is statically rendered with tokens */}
          <AvailableTokens
            initialTokens={allTokens}
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

export default function TradePage({ allTokens }: PageProps): JSX.Element {
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
      <BodyContent allTokens={allTokens} setModalOpen={setModalOpen} />
    </Layout>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  let tokens = getAllTokens()
  tokens = await addLogoColor(tokens)

  // Fetch these simultaneously
  const [blocksPerHour, currentBlockNumber, _tokens] = await Promise.all([
    getAverageBlockCountPerHour(),
    getCurrentBlockNumber(),
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
    },
    revalidate: 60,
  }
}
