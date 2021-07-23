'use strict'
const assert = require('assert')
const preset = require('./preset-browser')
const { address } = require('./constants')

;(async () => {
  const { browser, vanilla, metamask } = await preset()

  const trade = await vanilla.$('a[href="/trade"]')
  await Promise.all([
    vanilla.waitForNavigation(),
    trade.click()
  ])

  const connectWallet = await vanilla.$('nav > button')
  await connectWallet.click()
  const connectMetamask = await vanilla.$('div > button > div')
  await connectMetamask.click()
  await metamask.approve()

  await vanilla.bringToFront()
  await vanilla.waitForSelector(`span[title="${address}"]`)
  const closeButton = await vanilla.$('div.closeButton')
  await closeButton.click()

  const ethBalance = await vanilla.$eval('div.jsx-4148302646', el => {
    // remove ' ETH' from '<ethBalance> ETH' and convert to number
    return Number(el.innerText.slice(0, -4))
  })
  assert(ethBalance)

  // slow to load available tokens; seems to happen when hardhat is first started
  await vanilla.waitForSelector('div.jsx-3967655271 button')
  const availableTokens = await vanilla.$$('div.jsx-3967655271 button')
  assert(availableTokens.length)

  async function buyToken (availableToken) {
    await availableToken.click()

    const amountToBuy = await vanilla.waitForSelector('input.jsx-3822091943')
    await amountToBuy.click()
    await amountToBuy.press('ArrowUp')

    const buyToken = await vanilla.waitForSelector('span.jsx-459007937')
    await buyToken.click()

    await metamask.confirmTransaction()
    await vanilla.bringToFront()

    const closeButton = await vanilla.waitForSelector('button.jsx-783097308')
    // timeout added
    // component seems to be rendered twice, first .click() sometimes wasnt enough.
    // todo: remove timeout
    await new Promise(resolve => setTimeout(resolve, 1000))
    await closeButton.click()
  }

  await buyToken(availableTokens[0])
  await buyToken(availableTokens[1])
  await buyToken(availableTokens[2])

  // wait for token positions to show
  assert(await vanilla.waitForSelector('div[role="rowgroup"].jsx-1755455904 > :nth-child(3) .jsx-2866363978'))

  console.log('finished')
  setTimeout(() => browser.close(), 2000)
})()
