'use strict'

function newPending (browser) {
  return new Promise(resolve => browser.once('targetcreated', () => setTimeout(resolve, 3000)))
}

async function goToPending (metamask) {
  await metamask.bringToFront()

  const sendSelector = '#app-content > div > div.main-container-wrapper > div > div > div > div.home__balance-wrapper > div > div.wallet-overview__buttons > button:nth-child(2)'
  const send = await metamask.waitForSelector(sendSelector)
  await send.click()

  const cancelSelector = '#app-content > div > div.main-container-wrapper > div > div.page-container__header.send__header > a'
  const cancel = await metamask.waitForSelector(cancelSelector)
  await cancel.click()
}

async function chooseConfirm (metamask) {
  const confirmSelector = '#app-content > div > div.main-container-wrapper > div > div.confirm-page-container-content > div.page-container__footer > footer > button.button.btn-primary.page-container__footer-button'
  const confirm = await metamask.waitForSelector(confirmSelector)
  await confirm.click()
}

module.exports = {
  newPending,
  goToPending,
  chooseConfirm
}
