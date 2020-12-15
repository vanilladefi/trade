import ethers from 'ethers'
import React from 'react'

const providers = {
  'Injected Web3 runtime': {
    getWeb3: () => {
      if (!window.web3) throw new Error('No web3 instance found in runtime')
      const provider = new ethers.providers.Web3Provider(
        window.web3.currentProvider
      )
      const signer = provider.getSigner()
      return provider, signer
    },
  },
}

const WalletContext = React.createContext({ modalOpen: false })

export { WalletContext, providers }
