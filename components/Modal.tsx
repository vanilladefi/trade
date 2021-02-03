import classNames from 'classnames'
import React, { ReactNode, useEffect, useState } from 'react'

type Callback = () => void
type Props = {
  children?: ReactNode
  open?: boolean
  onRequestClose?: Callback
}

const Modal = ({
  children,
  open = false,
  onRequestClose,
}: Props): JSX.Element => {
  const [isOpen, setOpen] = useState(false)
  const curtainClasses = classNames('curtain', { closed: !isOpen })
  useEffect(() => {
    setOpen(open)
  }, [open])
  return (
    <>
      {open && (
        <div
          className={curtainClasses}
          onClick={(e) => {
            e.preventDefault()
            setOpen(false)
            setTimeout(() => onRequestClose && onRequestClose(), 200)
          }}
        >
          <div
            className='modal'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            {children}
          </div>
        </div>
      )}
      <style jsx>{`
        .curtain {
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          background: ${isOpen ? 'var(--curtain-background)' : 'transparent'};
          backdrop-filter: ${isOpen ? 'var(--curtain-backdropfilter)' : 'none'};
          z-index: 999;
          cursor: pointer;
          transition: 0.2s ease backdrop-filter, 0.2s ease background;
        }
        .modal {
          width: 30rem;
          height: auto;
          border-radius: 1.5rem;
          background: var(--white);
          z-index: 1000;
          cursor: default;
          opacity: ${isOpen ? 1 : 0};
          transition: 0.1s ease opacity;
          pointer-events: all;
        }
        .closed {
          display: none;
          pointer-events: click-through;
        }
      `}</style>
    </>
  )
}

export default Modal
