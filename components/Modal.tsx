import classNames from 'classnames'
import Image from 'next/image'
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
        <div className={curtainClasses}>
          <div
            className='modal'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <div
              className='closeButton'
              onClick={(e) => {
                e.preventDefault()
                setOpen(false)
                setTimeout(() => onRequestClose && onRequestClose(), 200)
              }}
            >
              <Image src='/images/close-button.svg' width='44' height='44' />
            </div>
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

          transition: 0.2s ease backdrop-filter, 0.2s ease background;
        }
        .modal {
          width: 30rem;
          height: auto;
          position: relative;
          border-radius: 1.5rem;
          background: var(--white);
          z-index: 1000;
          cursor: default;
          opacity: ${isOpen ? 1 : 0};
          transition: 0.1s ease opacity;
          pointer-events: all;
          --iconsize: 2rem;
        }
        .closeButton {
          position: absolute;
          top: -14px;
          cursor: pointer;
          right: -14px;
          z-index: 99;
          width: 44px;
          height: 44px;
          line-height: 0;
          border-radius: 100%;
          transition: transform 0.2s ease-in-out;
          border: 2px solid transparent;
        }
        .closeButton:hover {
          transform: scale(1.1);
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
