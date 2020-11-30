import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  open?: boolean,
  onRequestClose?:
}

const Modal = ({ children, open = false, onRequestClose }: Props): JSX.Element => (
  <>
   {open && <div className="curtain" onClick={() => onRequestClose()}>
     <div className="modal">
      {children}
     </div>
   </div>}
   <style jsx>{`
     .curtain {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: var(--curtain-background);
        backdrop-filter: var(--curtain-backdropfilter);
        z-index: 999;
     }
     .modal {
        width: 480px;
        height: auto;
        border-radius: 32px;
        background: var(--white);
        z-index: 1000;
     }
   `}</style>
  </>
)

export default Modal
