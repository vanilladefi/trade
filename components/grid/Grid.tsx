import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  className?: string
  gap?: string
  columns?: number
}

const GridTemplate = ({
  children,
  className,
  gap = '89px',
  columns = 3,
}: Props): JSX.Element => {
  return (
    <>
      <div className={className}>{children}</div>
      <style jsx>{`
        div {
          display: grid;
          width: 100%;
          grid-gap: ${gap};
          grid-template-columns: repeat(${columns}, minmax(min-content, 1fr));
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
