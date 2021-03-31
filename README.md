# vanilladefi.com

## Developing

By default, this dApp runs on a local testnet, of which parameters are defined in `.env`, `.env.local` (priorized when developing) or `.env.production` (used in npm run build). The local testnet needs to be ran separately, but can be left to run without restarts.

### How to run the local testnet over mainnet fork 

1. Clone the repo `vanilladefi/contracts`: https://github.com/vanilladefi/contracts
2. Run `npm install` inside the newly cloned contracts repo
3. Run `cp .secrets.env.example .secrets.env` and edit the API_KEYs into `.secrets.env`   
4. Run `npm run node:mainnet-fork`. This runs a local Hardhat testnet in `localhost:8545` with **chainid 1** , creates test accounts with 10k ETH each and deploys the Vanilla contracts automatically.
5. Change the chainid setting in Metamask's `localhost:8545`-network, from 1337 to 1 

To use the test accounts in Metamask, you need to import one of the accounts by its private key to a wallet of your choosing. These accounts will be the same on every run, so you only need to do this once per machine.

6. Run `npm run node:test-accounts` to get a list of Hardhat test-accounts
7. Pick one account, and import it into Metamask by copying the private key

### Running the app itself

```bash
npm install
npm run dev
```

### Running the app locally without testnet (UI dev purposes)
1. Create a `env.local` with `NEXT_PUBLIC_CHAIN_ID=1`
2. `npm run dev`

The app should be now accessible at `localhost:3000`.
