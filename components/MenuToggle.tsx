import { motion, Variant } from 'framer-motion'
import * as React from 'react'

type PathProps = {
  d: string
  variants: Record<string, Variant>
}

type MenuToggleProps = {
  toggle: () => void
}

const Path: React.FC<PathProps> = (props: PathProps) => (
  <motion.path
    fill='transparent'
    strokeWidth='2.5'
    stroke='black'
    strokeLinecap='round'
    initial={{ opacity: 1 }}
    {...props}
  />
)

const MenuToggle: React.FC<MenuToggleProps> = ({ toggle }: MenuToggleProps) => (
  <>
    <button className='menuButton' aria-label='Open menu' onClick={toggle}>
      <svg width='32' height='24' viewBox='0 0 32 24'>
        <Path
          d='M 2 7 L 30 7'
          variants={{
            closed: { d: 'M 2 7 L 30 7' },
            open: { d: 'M 2 17.5 L 30 3.5' },
          }}
        />
        <Path
          d='M 2 16.346 L 30 16.346'
          variants={{
            closed: { d: 'M 2 16.346 L 30 16.346' },
            open: { d: 'M 2 3.5 L 30 17.346' },
          }}
        />
      </svg>
    </button>
    <style jsx>{`
      .menuButton {
        background: none;
        z-index: 11;
        position: relative;
        border: 0;
        outline: 0;
        width: 44px;
        height: 44px;
        cursor: pointer;
      }
    `}</style>
  </>
)

export default MenuToggle
