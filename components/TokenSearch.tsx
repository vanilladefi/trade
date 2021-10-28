import useKeyboardInputListener from 'hooks/useKeyboardInputListener'
import { Search } from 'react-feather'
import { useRecoilState } from 'recoil'
import { tokenSearchQuery } from 'state/tokenSearch'

interface Props {
  placeholder: string
}

const TokenSearch: React.FC<Props> = ({ placeholder }: Props) => {
  const [value, setValue] = useRecoilState(tokenSearchQuery)
  useKeyboardInputListener(['Escape', 'Esc'], () => setValue(''))
  return (
    <div className='container'>
      <Search />
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
      />
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        input {
          flex: 1;
          height: 2rem;
          margin-left: 1rem;
          border: none;
          outline: none;
          font-size: 1.2rem;
          line-height: 118%;
          color: #1c1c1c;
        }
        input::placeholder {
          opacity: 50%;
        }
      `}</style>
    </div>
  )
}

export default TokenSearch
