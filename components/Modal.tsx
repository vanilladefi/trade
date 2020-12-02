import React, { ReactNode, useState, useEffect } from 'react'

type Callback = () => void
type Props = {
  children?: ReactNode
  open?: boolean
  onRequestClose: Callback
}

const Modal = ({
  children,
  open = false,
  onRequestClose,
}: Props): JSX.Element => {
  const [isOpen, setOpen] = useState(false)
  useEffect(() => {
    setOpen(open)
  }, [open])
  return (
    <>
      {open && (
        <div
          className='curtain'
          onClick={(e) => {
            e.preventDefault()
            setOpen(false)
            onRequestClose()
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
          position: absolute;
          top: 0;
          left: 0;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: ${isOpen ? 'var(--curtain-background)' : 'transparent'};
          backdrop-filter: ${isOpen ? 'var(--curtain-backdropfilter)' : 'none'};
          z-index: 999;
          cursor: pointer;
          transition: 0.8s ease backdrop-filter, 0.2s ease background;
        }
        .modal {
          width: 480px;
          height: auto;
          border-radius: 32px;
          background: var(--white);
          z-index: 1000;
          padding: var(--modalpadding);
          cursor: default;
          opacity: ${isOpen ? 1 : 0};
          transition: 0.1s ease opacity;
        }
      `}</style>
    </>
  )
}

export default Modal
