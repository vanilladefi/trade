import { BigNumber, constants, Event, utils } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'
import { MerkleTree } from 'merkletreejs'
import { VanillaV1MigrationState__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1MigrationState__factory'
import { VanillaV1Token01 } from 'types/typechain/vanilla_v1.1/VanillaV1Token01'
import { VanillaV1Token02 } from 'types/typechain/vanilla_v1.1/VanillaV1Token02'

export type SnapshotState = {
  blockNumber: number
  timeStamp: number
  conversionDeadline: number
  accounts: { [address: string]: BigNumber }
}

const toSnapshotState = (
  state: SnapshotState,
  event: { blockNumber: number; from: string; to: string; value: BigNumber },
) => {
  let prev = state.accounts[event.to] || BigNumber.from(0)
  state.accounts[event.to] = prev.add(event.value)

  if (event.from !== constants.AddressZero) {
    if (!state.accounts[event.from]) {
      if (event.value.gt(0)) {
        throw new Error(
          `something went wrong in ${event.blockNumber} from=${event.from} value=${event.value}`,
        )
      }
      state.accounts[event.from] = BigNumber.from(0)
    }
    prev = state.accounts[event.from]
    state.accounts[event.from] = prev.sub(event.value)
  }
  state.blockNumber = Math.max(event.blockNumber, state.blockNumber || 0)
  return state
}

export type AddressBalance = {
  address: string
  amount: BigNumber
}

export const toKeccak256Leaf = (balance: AddressBalance): string =>
  utils.solidityKeccak256(
    ['address', 'string', 'uint256'],
    [balance.address, ':', balance.amount],
  )

export const snapshot = async (
  token01: VanillaV1Token01,
  token02: VanillaV1Token02,
): Promise<{
  snapshotState: SnapshotState
  getProof: (balance: AddressBalance) => string[]
  verify: (balance: AddressBalance, root: string) => boolean
  root: string
  merkleTree: MerkleTree
}> => {
  const snapshotBlock = await token02
    .migrationState()
    .then((address) =>
      VanillaV1MigrationState__factory.connect(
        address,
        token02.provider,
      ).blockNumber(),
    )
  const tokenTransfers = snapshotBlock.eq(0)
    ? await token01.queryFilter(token01.filters.Transfer(null, null, null))
    : await token01.queryFilter(
        token01.filters.Transfer(null, null, null),
        0,
        snapshotBlock.toNumber(),
      )
  const byBlockIndexOrder = (a: Event, b: Event) =>
    a.blockNumber - b.blockNumber || a.logIndex - b.logIndex
  const transfers = tokenTransfers
    .sort(byBlockIndexOrder)
    .map(({ blockNumber, args }) => ({ blockNumber, ...args }))

  const snapshotState = transfers.reduce(toSnapshotState, {
    blockNumber: 0,
    accounts: {},
    timeStamp: 0,
    conversionDeadline: 0,
  })

  // fetch the timestamp after event reduction since it's timestamps are not included in the event data
  const blockAtSnapshot = await token01.provider.getBlock(
    snapshotState.blockNumber,
  )
  snapshotState.timeStamp = blockAtSnapshot.timestamp

  const leaves = Object.entries(snapshotState.accounts).map(
    ([address, amount]) => ({
      address,
      amount,
      hash: toKeccak256Leaf({ address, amount }),
    }),
  )
  const merkleTree = new MerkleTree(
    leaves.map((x) => x.hash),
    keccak256,
    { sortPairs: true, hashLeaves: false },
  )
  if (merkleTree.getHexRoot() === '0x' && leaves.length > 0) {
    console.table(leaves)
    throw new Error('Invalid root')
  }
  const root = utils.hexZeroPad(merkleTree.getHexRoot(), 32)
  return {
    snapshotState,
    getProof: (balance: AddressBalance) =>
      merkleTree
        .getHexProof(toKeccak256Leaf(balance))
        .map((hex) => utils.hexZeroPad(hex, 32)),
    verify: (balance: AddressBalance, root: string) => {
      const leaf = toKeccak256Leaf(balance)
      return merkleTree.verify(merkleTree.getHexProof(leaf), leaf, root)
    },
    root,
    merkleTree,
  }
}
