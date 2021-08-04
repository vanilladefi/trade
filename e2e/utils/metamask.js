'use strict'
const timeout = require('./timeout')

function newPending (browser) {
  return new Promise(resolve => browser.once(
    'targetcreated',
    () => timeout(3000).then(resolve)
  ))
}

async function goToPending (metamask) {
  await metamask.bringToFront()

  const send = await metamask.waitForSelector('.wallet-overview__buttons > :nth-child(2)')
  await send.click()

  const cancel = await metamask.waitForSelector('.page-container__header-close-text')
  await cancel.click()
}

async function chooseConfirm (metamask) {
  const confirm = await metamask.waitForSelector('.btn-primary')
  await confirm.click()
}

async function connectAccount (metamask) {
  const next = await metamask.waitForSelector('.btn-primary')
  await next.click()

  const connect = await metamask.waitForSelector('.page-container__footer .btn-primary')
  await connect.click()
}

module.exports = {
  newPending,
  goToPending,
  chooseConfirm
}
