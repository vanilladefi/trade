'use strict'
const { default: getMetamaskPath } = require('@nodefactory/dappeteer/dist/metamaskDownloader.js')
const puppeteer = require('puppeteer-core')
const { seed, address, password } = require('./constants')

const launchOptions = {
  headless: false,
  defaultViewport: { width: 1920, height: 1080 }
}

async function initMetamask (metamask) {
  await metamask.bringToFront()

  const getStarted = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div > button')
  await getStarted.click()

  const importWallet = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div.select-action__wrapper > div > div.select-action__select-buttons > div:nth-child(1) > button')
  await importWallet.click()

  const analytics = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div > div.metametrics-opt-in__footer > div.page-container__footer > footer > button.button.btn-default.page-container__footer-button')
  await analytics.click()

  const seedInput = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > form > div.first-time-flow__textarea-wrapper > div.MuiFormControl-root.MuiTextField-root.first-time-flow__textarea.first-time-flow__seedphrase > div > input')
  await seedInput.type(seed)

  const passwordInput = await metamask.waitForSelector('#password')
  await passwordInput.type(password)
  const confirmPassword = await metamask.waitForSelector('#confirm-password')
  await confirmPassword.type(password)

  const agreeTerms = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > form > div.first-time-flow__checkbox-container > div')
  await agreeTerms.click()

  const importDone = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > form > button')
  await importDone.click()
  const allDone = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > button')
  await allDone.click()

  const closePopover = await metamask.waitForSelector('#popover-content > div > div > section > header > div > button')
  await closePopover.click()
}

async function useHardhatNetwork (metamask) {
  await metamask.bringToFront()

  const networkPicker = await metamask.waitForSelector('#app-content > div > div.app-header.app-header--back-drop > div > div.app-header__account-menu-container > div.app-header__network-component-wrapper > div > span')
  await networkPicker.click()

  const customRPC = await metamask.waitForSelector('#app-content > div > div.menu-droppo-container.network-droppo > div > li:nth-child(9)')
  await customRPC.click()

  async function setChainId () {
    const addNetwork = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.settings-page__sub-header > div > button')
    await addNetwork.click()

    const localhost8545 = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div.networks-tab__networks-list.networks-tab__networks-list--selection > div:nth-child(6) > div.networks-tab__networks-list-name')
    await localhost8545.click()

    const chainIdInput = await metamask.waitForSelector('#chainId')
    await chainIdInput.click({ clickCount: 3 }) // select all text for easy overwrite
    await chainIdInput.type('1')

    const saveNetwork = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div.networks-tab__network-form > div.network-form__footer > button.button.btn-secondary')
    await saveNetwork.click()
  }

  async function isHardhatNetwork () {
    const currentNetwork = await metamask.waitForSelector('#app-content > div > div.app-header.app-header--back-drop > div > div.app-header__account-menu-container > div.app-header__network-component-wrapper > div > span')
    const innerText = await currentNetwork.evaluate(el => el.innerText)
    return innerText === 'Private Network' || innerText === 'Localhost 8545'
  }

  let i = 0
  while (!await isHardhatNetwork() && i !== 5) {
    await setChainId()
    i++
  }
  if (i === 5) throw new Error('failed to set metamask chain id')

  const closeSettings = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__header > div.settings-page__close-button')
  await closeSettings.click()
}

async function connectMetamask (browser, vanilla, metamask) {
  await vanilla.bringToFront()
  const connectWallet = await vanilla.waitForSelector('nav > button')
  await connectWallet.click()
  const connectMetamask = await vanilla.waitForSelector('div > button > div')
  await Promise.all([
    connectMetamask.click(),
    new Promise(resolve => browser.once('targetcreated', resolve))
  ])

  await metamask.bringToFront()
  // await new Promise(resolve => setTimeout(resolve, 3000))
  const send = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div > div.home__balance-wrapper > div > div.wallet-overview__buttons > button:nth-child(2)')
  await send.click()
  const cancel = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.page-container__header.send__header > a')
  await cancel.click()
  const next = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.permissions-connect-choose-account > div.permissions-connect-choose-account__footer-container > div.permissions-connect-choose-account__bottom-buttons > button.button.btn-primary')
  await next.click()
  const connect = await metamask.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.page-container.permission-approval-container > div.permission-approval-container__footers > div.page-container__footer > footer > button.button.btn-primary.page-container__footer-button')
  await connect.click()

  await vanilla.bringToFront()
  await vanilla.waitForSelector(`span[title="${address}"]`)
  const closeButton = await vanilla.$('div.closeButton')
  await closeButton.click()
}

module.exports = async function preset () {
  const METAMASK_PATH = await getMetamaskPath()
  const browser = await puppeteer.launch({
    ...launchOptions,
    args: [`--disable-extensions-except=${METAMASK_PATH}`, `--load-extension=${METAMASK_PATH}`]
  })
  // wait for metamask to open
  await new Promise(resolve => setTimeout(resolve, 3000))
  const [vanilla, metamask] = await browser.pages()
  await vanilla.goto('http://localhost:3000')

  await initMetamask(metamask)
  await useHardhatNetwork(metamask)
  await connectMetamask(browser, vanilla, metamask)

  return { browser, vanilla, metamask }
}
