'use strict'
const assert = require('assert')
const preset = require('./preset-browser')
const { newPending, goToPending, chooseConfirm } = require('./utils/metamask')
const { closeTrade } = require('./utils/vanilla')

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

  await vanilla.waitForSelector('div.jsx-3967655271 button')
  const availableTokens = await vanilla.$$('div.jsx-3967655271 button')
  assert(availableTokens.length)

  async function buyToken (availableToken) {
    await availableToken.click()

    await new Promise(resolve => setTimeout(resolve, 2000))
    const amountToBuy = await vanilla.waitForSelector('input.jsx-3822091943')
    await amountToBuy.click()
    await amountToBuy.press('ArrowUp')

    const buyToken = await vanilla.waitForSelector('span.jsx-459007937')
    await Promise.all([
      buyToken.click(),
      newPending(browser)
    ])
    await goToPending(metamask)
    await chooseConfirm(metamask)

    await vanilla.bringToFront()

    await closeTrade(vanilla)
  }

  await buyToken(availableTokens[0])
  await buyToken(availableTokens[1])
  await buyToken(availableTokens[2])

  // wait for token positions to show
  assert(await vanilla.waitForSelector('div[role="rowgroup"].jsx-1755455904 > :nth-child(3) .jsx-2866363978'))
  const sellPositions = await vanilla.$$('div[role="rowgroup"].jsx-1755455904 .buttonGroup > button.roundedTopLeft')

  async function sellToken (sellPosition) {
    await sellPosition.click()

    const max = await vanilla.waitForSelector('#__next > div.jsx-3194571062.curtain > div > section > div > section > section > div > div > div:nth-child(1) > div.jsx-863677993 > div > button')
    await max.click()

    const sell = await vanilla.waitForSelector('#__next > div.jsx-3194571062.curtain > div > section > div > div > button > div')
    await Promise.all([
      sell.click(),
      newPending(browser)
    ])
    await goToPending(metamask)
    await chooseConfirm(metamask)

    await vanilla.bringToFront()

    await closeTrade(vanilla)
  }

  await sellToken(sellPositions[0])
  await sellToken(sellPositions[1])
  await sellToken(sellPositions[2])

  // wait for token positions to update
  await vanilla.waitForSelector('div.jsx-1755455904.list-empty')

  console.log('finished')
  setTimeout(() => browser.close(), 2000)
})()
