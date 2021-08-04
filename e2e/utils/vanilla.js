'use strict'
const timeout = require('./timeout')

async function closeTrade (vanilla) {
  const closeButton = await vanilla.waitForSelector('button.jsx-783097308')
  await timeout(3000)
  await closeButton.click()
}

module.exports = {
  closeTrade
}
