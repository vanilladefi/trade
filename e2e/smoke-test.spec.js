'use strict'
const assert = require('assert')
const puppeteer = require('puppeteer-core')
const dappeteer = require('@nodefactory/dappeteer')
const launchOptions = { headless: false, defaultViewport: { width: 1920, height: 1080 } }
const vanillaLocation = 'http://localhost:3000'

// css selectors
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors

async function useHardhatNetwork (metamaskPage) {
  await metamaskPage.bringToFront()

  const networkPicker = await metamaskPage.$('div.network-display.chip--ui-3')
  await networkPicker.click()

  const customRPC = await metamaskPage.$('div.color-indicator--border-color-ui-2.color-indicator--color-transparent')
  await customRPC.click()

  const localhost8545 = await metamaskPage.$('div.color-indicator--color-ui-4')
  await localhost8545.click()

  const chainIdInput = await metamaskPage.$('input#chainId')
  await chainIdInput.click({ clickCount: 3 }) // select all text; easy overwrite
  await chainIdInput.type('1')

  const saveNetwork = await metamaskPage.$('div.network-form__footer > button.button.btn-secondary')
  await saveNetwork.click()

  const closeSettings = await metamaskPage.$('div.settings-page__close-button')
  await closeSettings.click()
}

;(async () => {
  const browser = await dappeteer.launch(puppeteer, launchOptions)
  // https://hardhat.org/hardhat-network/#hardhat-network-initial-state
  const seed = 'test test test test test test test test test test test junk'
  const metamask = await dappeteer.setupMetamask(browser, { seed })
  const [vanilla, metamaskPage] = await browser.pages()
  await useHardhatNetwork(metamaskPage)

  await vanilla.bringToFront()
  await vanilla.goto(vanillaLocation)

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
  await vanilla.waitForSelector('span[title="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]')
  const closeButton = await vanilla.$('div.closeButton')
  await closeButton.click()

  assert(
    await vanilla.$eval('div.jsx-4148302646', el => el.innerText),
    '10000.000 ETH'
  )
  console.log('finished')
  setTimeout(() => browser.close(), 2000)
})()
