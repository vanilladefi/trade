'use strict'
const puppeteer = require('puppeteer-core')
const dappeteer = require('@nodefactory/dappeteer')
const { seed } = require('./constants')

const launchOptions = {
  headless: false,
  defaultViewport: { width: 1920, height: 1080 }
}

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

module.exports = async function preset () {
  const browser = await dappeteer.launch(puppeteer, launchOptions)
  const metamask = await dappeteer.setupMetamask(browser, { seed })
  const [vanilla, metamaskPage] = await browser.pages()

  await useHardhatNetwork(metamaskPage)

  await vanilla.goto('http://localhost:3000')
  await vanilla.bringToFront()

  return { browser, vanilla, metamask }
}
