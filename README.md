# vanilladefi.com

## Developing

Make sure you have `docker` and `nodejs` installed on your machine.

Run following commands to get the dev environment up and running:

```bash
git submodule update --init --recursive
```

Go to `/contracts` folder and install dependencies (make sure to use pnpm, check out instructions on the repo https://github.com/vanilladefi/contracts). Then run `pnpm node:test-accounts` and you will get the test accounts. Create `.env.local` and use it there:
```
TEST_ACCOUNTS=["<account_key>"]
```
Store the matching private key somewhere since you will need it if you want to connect Metamask wallet later.

Then you can start the docker:
```bash
docker-compose up -d
```

It might take a while but once it is finisehd go to localhost:3000 and you should be able to see project running.

If you want to use Metamask wallet take the matching private key for account you added behind `TEST_ACCOUNT` env. Import that private key to Metamask. Connect to localhost:8584 with Metamask. If you get "Wallet connection failed. Check that you are using Ethereum network" error. Click the account icon (ball on top right corner) and go to settings -> network. Select the localhost:8584 and change the Chain ID value to `1`. After that you should be able to connect to Vanilla with your Metamask account.