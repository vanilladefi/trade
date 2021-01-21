import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  className?: string
  gap?: string
  colMinWidth?: string
}

const GridTemplate = ({
  children,
  className,
  gap = '89px',
  colMinWidth = '320px',
}: Props): JSX.Element => {
  return (
    <>
      <div className={className}>{children}</div>
      <style jsx>{`
        div {
          display: grid;
          width: 100%;
          grid-gap: ${gap};
          grid-template-columns: repeat(auto-fill, minmax(${colMinWidth}, 1fr));
        }
      `}</style>
    </>
  )
}

const GridItem = ({ children }: Props): JSX.Element => {
  return (
    <>
      <div>{children}</div>
      <style jsx>{`
        div {
          display: grid;
          width: auto;
        }
      `}</style>
    </>
  )
}

export { GridTemplate, GridItem }
