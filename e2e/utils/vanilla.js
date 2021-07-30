'use strict'

async function closeTrade (vanilla) {
  const closeButton = await vanilla.waitForSelector('button.jsx-783097308')
  await new Promise(resolve => setTimeout(resolve, 3000))
  await closeButton.click()
}

module.exports = {
  closeTrade
}
