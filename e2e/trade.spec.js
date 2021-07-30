'use strict'
const assert = require('assert')
const preset = require('./preset-browser')

;(async () => {
  const { browser, vanilla, metamask } = await preset()

  await vanilla.bringToFront()
  const trade = await vanilla.waitForSelector('a[href="/trade"]')
  await Promise.all([
    vanilla.waitForNavigation(),
    trade.click()
  ])

  const ethBalance = await vanilla.waitForSelector('div.jsx-4148302646')
  assert(await ethBalance.evaluate(el => {
    // remove ' ETH' from '<ethBalance> ETH' and convert to number
    return Number(el.innerText.slice(0, -4))
  }))

  // slow to load my positions and available tokens; seems to happen when hardhat is first started
  await vanilla.waitForSelector('div.jsx-1755455904.list-empty')
  await vanilla.waitForSelector('div.jsx-3967655271 button')
  const availableTokens = await vanilla.$$('div.jsx-3967655271 button')
  assert(availableTokens.length)

  async function buyToken (availableToken) {
    await availableToken.click()

    // await new Promise(resolve => setTimeout(resolve, 2000))
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
    // await new Promise(resolve => setTimeout(resolve, 1000))
    await closeButton.click()
    // await new Promise(resolve => setTimeout(resolve, 2000))
  }

  await buyToken(availableTokens[0])
  await buyToken(availableTokens[1])
  await buyToken(availableTokens[2])

  // wait for token positions to show
  assert(await vanilla.waitForSelector('div[role="rowgroup"].jsx-1755455904 > :nth-child(3) .jsx-2866363978'))

  async function sellToken () {}

  console.log('finished')
  setTimeout(() => browser.close(), 2000)
})()
