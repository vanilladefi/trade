import useAllTransactions from 'hooks/useAllTransactions'
import { useRouter } from 'next/router'
import { Column } from './grid/Flex'

const TransactionList = (): JSX.Element => {
  const { transactions } = useAllTransactions()
  const router = useRouter()
  return (
    <Column>
      {transactions === null && <span>Your transactions will appear here</span>}
      {transactions !== null &&
        transactions.map((transaction) => (
          <div key={transaction.hash}>
            <span>{transaction.hash}</span>
            <span
              onClick={() => router.replace(`/trade?id=${transaction.hash}`)}
            >
              Open transaction
            </span>
          </div>
        ))}
      <style jsx>{`
        span {
          text-align: center;
          width: 100%;
          font-size: var(--minisize);
        }
        span > * {
          color: var(--beige);
        }
      `}</style>
    </Column>
  )
}

export default TransactionList
