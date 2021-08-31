import classNames from 'classnames'
import useKeyboardInputListener from 'hooks/useKeyboardInputListener'
import Image from 'next/image'
import React, { ReactNode, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { modalCloseEnabledState } from 'state/ui'

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
  const modalCloseEnabled = useRecoilValue(modalCloseEnabledState)

  const curtainClasses = classNames('curtain', { closed: !isOpen })

  const close = () => {
    if (modalCloseEnabled) {
      setOpen(false)
      setTimeout(() => onRequestClose && onRequestClose(), 200)
    }
  }

  useKeyboardInputListener(['Escape', 'Esc'], close)
  useEffect(() => {
    setOpen(open)
    // Prevent page from scrolling on background when modal is open
    document.body.style.overflowY = open ? 'hidden' : 'auto'
  }, [open])

  return (
    <>
      {open && (
        <div className={curtainClasses}>
          <div
            className='modal'
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <div
              className='closeButton'
              onClick={(e) => {
                e.preventDefault()
                close()
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
          width: 100%;
          align-items: start;
          justify-content: flex-start;
          height: 100vh;
          background: ${isOpen ? 'var(--curtain-background)' : 'transparent'};
          backdrop-filter: ${isOpen ? 'var(--curtain-backdropfilter)' : 'none'};
          z-index: 5;
          transition: 0.2s ease backdrop-filter, 0.2s ease background;
          overflow: auto;
        }
        @media (min-height: 600px) {
          .curtain {
            align-items: center;
            justify-content: center;
          }
        }
        .modal {
          width: var(--modalwidth);
          max-width: fit-content;
          height: auto;
          position: relative;
          border-radius: 1.5rem;
          background: var(--white);
          z-index: 6;
          cursor: default;
          opacity: ${isOpen ? 1 : 0};
          transition: 0.1s ease opacity;
          pointer-events: all;
          --iconsize: 2rem;
          margin: 1rem auto 1.5rem;
        }
        .closeButton {
          position: absolute;
          top: -14px;
          cursor: pointer;
          right: -14px;
          z-index: 7;
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

export type ContentProps = {
  children?: ReactNode
}
export const ContentWrapper = ({ children }: ContentProps): JSX.Element => (
  <div>
    {children}
    <style jsx>{`
      div {
        padding: 1rem 1.8rem;
        max-width: 500px;
        flex-shrink: 1;
        display: flex;
        flex-wrap: wrap;
        font-family: var(--bodyfont);
        font-size: var(--bodysize);
        font-weight: var(--bodyweight);
      }
    `}</style>
  </div>
)

export default Modal
