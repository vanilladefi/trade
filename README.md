# vnl.com

## Developing

By default, this dApp runs on a local testnet, of which parameters are defined in `.env`. The local testnet needs to be ran separately, but can be left to run without restarts.

### How to run the local testnet

1. Clone the repo `vanilla-contracts`: https://github.com/vanilladefi/contracts
2. Run `npm install` inside the newly cloned contracts repo
3. Run `npm run testnet`. This runs a local Hardhat testnet that's RPC URL is `localhost:8545`, creates test accounts and deploys a test environment of Vanilla.
To use the test accounts, you need to import one of the accounts by its private key to a wallet of your choosing. These accounts will be the same on every run, so you only need to do this once per machine.

### Running the app itself

```bash
npm install
npm run dev
```

### Running the app locally without testnet (UI dev purposes)
1. Create a `env.local` with `NEXT_PUBLIC_CHAIN_ID=1`
2. `npm run dev`

The app should be now accessible at `localhost:3000`.
