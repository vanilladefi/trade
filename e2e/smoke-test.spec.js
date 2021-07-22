'use strict'
const assert = require('assert')
const preset = require('./preset-browser')
const { address } = require('./constants')

;(async () => {
  const { browser, vanilla, metamask } = await preset()

  const startTrading = await vanilla.$('a[href="/trade"]')
  await Promise.all([
    vanilla.waitForNavigation(),
    startTrading.click()
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

  assert(
    await vanilla.$eval('div.jsx-4148302646', el => el.innerText),
    '10000.000 ETH'
  )
  console.log('finished')
  setTimeout(() => browser.close(), 2000)
})()
