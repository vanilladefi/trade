'use strict'
const { default: getMetamaskPath } = require('@nodefactory/dappeteer/dist/metamaskDownloader.js')
const puppeteer = require('puppeteer-core')
const { seed, address, password } = require('./constants')
const { newPending, goToPending, connectAccount } = require('./utils/metamask')
const timeout = require('./utils/timeout')

const launchOptions = {
  headless: false,
  defaultViewport: { height: 1080 }
}

async function initMetamask (metamask) {
  await metamask.bringToFront()

  const continueButton = await metamask.waitForSelector('.welcome-page button')
  await continueButton.click()

  const importLink = await metamask.waitForSelector('.first-time-flow button')
  await importLink.click()

  const metricsOptOut = await metamask.waitForSelector('.metametrics-opt-in button.btn-primary')
  await metricsOptOut.click()

  const showSeedPhraseInput = await metamask.waitForSelector('#ftf-chk1-label')
  await showSeedPhraseInput.click()

  const seedPhraseInput = await metamask.waitForSelector('.first-time-flow textarea')
  await seedPhraseInput.type(seed)

  const passwordInput = await metamask.waitForSelector('#password')
  await passwordInput.type(password)

  const passwordConfirmInput = await metamask.waitForSelector('#confirm-password')
  await passwordConfirmInput.type(password)

  const acceptTerms = await metamask.waitForSelector('.first-time-flow__terms')
  await acceptTerms.click()

  const restoreButton = await metamask.waitForSelector('.first-time-flow button')
  await restoreButton.click()

  const doneButton = await metamask.waitForSelector('.end-of-flow button')
  await doneButton.click()

  const popupButton = await metamask.waitForSelector('.popover-header__button')
  await popupButton.click()
}

async function useHardhatNetwork (metamask) {
  await metamask.bringToFront()

  const networkDisplay = await metamask.waitForSelector('.network-display')
  await networkDisplay.click()

  const customRPC = await metamask.waitForSelector('.network-droppo :nth-child(9)')
  await customRPC.click()

  const localhost8545 = await metamask.waitForSelector('.networks-tab__networks-list :nth-child(6)')
  await localhost8545.click()

  await timeout(1000)
  const chainIdInput = await metamask.waitForSelector('#chainId')
  await chainIdInput.click({ clickCount: 3 }) // select all text for easy overwrite
  await chainIdInput.type('1')

  const saveNetwork = await metamask.waitForSelector('.network-form__footer .btn-secondary')
  await saveNetwork.click()

  const closeSettings = await metamask.waitForSelector('.settings-page__close-button')
  await closeSettings.click()

async function connectMetamask (browser, vanilla, metamask) {
  await vanilla.bringToFront()
  const connectWallet = await vanilla.waitForSelector('nav > button')
  await connectWallet.click()
  const connectMetamask = await vanilla.waitForSelector('div > button > div')
  await Promise.all([
    connectMetamask.click(),
    newPending(browser)
  ])

  await goToPending(metamask)
  await connectAccount(metamask)

  await vanilla.bringToFront()
  await vanilla.waitForSelector(`span[title="${address}"]`)
  const closeButton = await vanilla.$('.closeButton')
  await closeButton.click()
}

module.exports = async function preset () {
  const METAMASK_PATH = await getMetamaskPath()
  const browser = await puppeteer.launch({
    ...launchOptions,
    args: [`--disable-extensions-except=${METAMASK_PATH}`, `--load-extension=${METAMASK_PATH}`]
  })
  // wait for metamask to open
  await timeout(3000)
  const [vanilla, metamask] = await browser.pages()
  await vanilla.goto('http://localhost:3000')

  await initMetamask(metamask)
  await useHardhatNetwork(metamask)
  await connectMetamask(browser, vanilla, metamask)

  return { browser, vanilla, metamask }
}
