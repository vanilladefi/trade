---
title: 'Frequently Asked Questions'
layout: faq
---

## What is Vanilla?

Vanilla is a trustless interface for DeFi that rewards you for making a profit trading and lending tokens. Essentially Vanilla provides a unified interface for all your DeFi activities and #ProfitMining means that for each fraction of an ether you make in profit, you also mine VNL governance tokens.

Vanilla is launching with support for trading on [Uniswap](https://uniswap.org/) as the first way to make profit. Lending the tokens you've bought on [Aave](https://aave.com/) or [Compound](https://compound.finance/) to further increase your profits is coming soon after.

Start #ProfitMining.

## What is #ProfitMining?

Profit mining is a novel token distribution mechanism, where you "mine" VNL tokens by making a profit. The more profit you make, the more VNL you mine. Mining gets more difficult over time, making early mining more lucrative to bootstrap the Vanilla economy.

In practice, the way profit mining works is: when you use Vanilla to participate in trading or lending, you deploy capital (ETH) via the Vanilla smart contracts. When you sell your positions, the system calculates whether you have made a profit on the capital that you have put in. If you have, the system creates VNL for you, proportional to the amount of profit made.

## Why would I use Vanilla?

Vanilla provides a single trustless interface for conducting all your DeFi activities, so instead of using multiple services, you can just use one. By using Vanilla you also participate in #ProfitMining, which increases your returns.

Furthermore, Vanilla keeps you safe as you explore the edges of financial innovation in DeFi. As more capital is deployed through Vanilla, VNL governance gains more power in directing these capital flows in ways which best serve the users interests and Vanilla becomes a sort of decentralized union charged with protecting its traders and lenders.

Firstly it ensures users are getting fair pricing across all the services they use through Vanilla. As a simple example, if a lending protocol is taking too large of a cut, Vanilla governance can remove profit mining incentives from that service, directing capital away from the rent-seeker and thus negatively impacting their revenue. If a lot of capital is being deployed through Vanilla, this decline in revenue could be significant enough for the lending provider to cut rates or get outcompeted by other cheaper lending providers.

Secondly, Vanilla provides a layer of security for users. Vanilla can conduct extensive due diligence on the protocols it integrates and the tokens it whitelists, as well as fund a variety of safety measures which would be unattainable for individual traders. A service that is being used through Vanilla could upgrade to a new version, which VNL governance thought might not be secure. Governance could temporarily remove #ProfitMining from this service to disincentivize users from deploying capital there until such a time when they were comfortable with the security properties.

Ultimately, the purpose of Vanilla is to make life easy for DeFi users.

## Can developers build on Vanilla?

Yes, absolutely. Vanilla provides a single interface for DeFi for retail users and developers alike. Developers no longer need to integrate multiple DeFi protocols, but instead can integrate just one. For example a developer could create an index token on top of Vanilla, which balances a portfolio of assets automatically using on-chain data and lends those assets on [Aave](https://aave.com/) or [Compound](https://compound.finance/) for additional passive returns. The indexing system would only have to interact with Vanilla smart contracts and of course participates in #ProfitMining too.

## How do I trade tokens using Vanilla?

Simply go to the trade page, choose a token and execute the purchase with ETH using [Metamask](https://metamask.io/) or [WalletConnect](https://walletconnect.org/). The Vanilla contracts will execute the purchase on [Uniswap](https://uniswap.org/) and the tokens will be stored in the Vanilla smart contract. You can sell the tokens at any time to claim profit mining rewards and once sold the ETH, including any profit you've made, will be returned to your wallet along with the VNL tokens you've mined.

## How do I lend tokens using Vanilla?

Lending is coming soon and is very simple in how it works. When you've purchased a token using Vanilla, if [Aave](https://aave.com/) or [Compound](https://compound.finance/) has a market for lending the token, you can choose which market to lend it in. The Vanilla contracts will send your tokens to that market, where they will accrue interest until you decide to end the lending or sell the tokens.

## Can I move tokens I've purchased through Vanilla?

Not right now. We will be adding this capability in the future, but it makes calculating profit mining rewards more difficult so we have left it out of scope for now.

## Does Vanilla include a native token?

Yes. VNL is the native asset of the Vanilla ecosystem. VNL is created by profit mining and is used for governance of the protocol.

## Was there an ICO or premine?

No. We think pre-mines very easily lead to unhealthy incentives and often do result in governance being controlled by the creators in practice. Additionally, we like the idea of core development teams having to use the product they are developing, hopefully creating a healthy feedback loop for innovation. 

This is why the only way to create VNL is by profit mining and this applies to the creators of Vanilla just as much as it applies to everyone else. In the future there will likely be a governance controlled treasury, which receives tokens based on usage to allocate to development, marketing and other functions, but the token holders will have to agree to all expenditures.

## Who created Vanilla and how will they make money?

Vanilla was developed by [Equilibrium](https://equilibrium.co/) and the smart contracts were deployed by an anonymous community member to the Ethereum blockchain. Equilibrium is hoping to make money by profit mining from the very beginning, which we expect will allow us to accumulate enough VNL to give us a reasonable return if Vanilla is successful and of course once the governance-controlled treasury is online we will apply for development grants.

## Is Vanilla secure?

The Vanilla system has been security audited extensively and there is an active bug bounty, but it is still experimental beta software as with most things built on Ethereum. We take the safety of your funds extremely seriously, but perfect security doesn't exist so tread carefully.

## Is Vanilla decentralized?

Yes. All of Vanilla's profit mining logic and algorithms are built into its smart contracts, which are non-upgradable, meaning no-one can change how they function and no-one can stop anyone else from using the system. 

## How are profit mining rewards calculated for trading?

For each token you trade, Vanilla maintains two key measures:

1. Weighted average exchange rate of purchases, WAER
2. Weighted average purchase block number, WAPBN

Weighted Average Exchange Rate of purchases is defined as: 

<img src="/images/faq/average_fx_formula.png"/>

Likewise, weighted average purchase block number is defined as:

<img src="/images/faq/average_block_formula.png"/>

When a trader makes profit her profit mining reward amount is calculated according to the *VNL Reward Formula:*

<img src="/images/faq/profit_mining_equation_with_expl.png"/>

Let's go through the formula component by component:

### Profit Component

T_i is the amount of profit in ETH made in the trade. Technically, the profit is calculated in WEI and then divided by 1*10^15 to obtain a 1000-fold profit component from each ETH made. The profit is calculated as sell price minus the Weighted Average Exchange Rate.

<img src="/images/faq/profit.png"/>

Whenever sell price exceeds the weighted average exchange rate, the profit is positive and VNL rewards will be attributed to the investor if she closes her position.

Profit is calculated in nominal ETH rather than relative, meaning that a larger investment will mine more VNL than a smaller one if the percentage profit is equal.

### Duration Ratio Component

The duration ratio component is in place to bootstrap usage by incentivizing early participation and longer holding periods.

<img src="/images/faq/trade_duration_ratio.png"/>

The nominator describes the number of blocks the trade has been open. Keeping the trade open longer will yield higher rewards. If the duration is zero, i.e. the trade is closed in the same block it was initiated, the profit will be zero. This ensures that no flash loan attacks can be carried out.

The denominator describes the number of blocks the Vanilla system itself has been operational. The denominator will increase over time as Ethereum block numbers increase and will decrease the D_i ratio. 

In other words, the duration ratio is just a ratio of times: The time the trade has been open compared to the time the system has been open. The times are measured in Ethereum blocks.

## Simple heuristics to illustrate the core mechanisms

The following charts and tables depict simple heuristics of the incentive mechanisms. In all heuristics we vary one input in the VNL reward formula while keeping the other inputs unchanged and plot the amount of VNL in each case.

The first case observes the VNL attribution as a function of profits. We keep the trade duration ratios constant and inspect what happens to the attributed VNL. As we increase the sell price of the trade, while keeping the WAER constant, our profits increase. As profits increase 5-fold from 2 ETH to 10 ETH or 10-fold from 2 ETH to 20 ETH, there is a linear relationship with the increase associated with the VNL reward. 

<img src="/images/faq/VNL_as_profit.jpg"/>

The second case observes the VNL attribution when we keep profits constant, but vary the trade duration ratio. The duration ratio is determined by how early the trader is participating in the Vanilla ecosystem and how long they are keeping their positions before closing them. The following chart depicts a case in which we keep the sell block number constant but vary the weighted average block, in which the trader has opened her position.

<img src="/images/faq/VNL_as_duration_ratio2.jpg"/>

We can easily see that when the duration ratio drops from 50 % to 10 % (factor of 0.2) also the VNL rewards decrease accordingly. 

The same relationship can be seen if we keep the average opening blocks constant, but increase the closing block further into the future.

<img src="/images/faq/VNL_as_duration_ratio.jpg"/>

## How will governance work in Vanilla?

Once the governance structures are in place, VNL holders will be able to determine the direction of Vanilla by voting on a variety of things such as new features, token whitelisting, treasury grant allocations and other ecosystem efforts.

Governance is planned to be implemented in Q4 2021 at which time we expect a reasonable amount of VNL token to have been mined and distributed around the ecosystem.
