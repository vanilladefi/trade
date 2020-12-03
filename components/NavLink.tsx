import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

type Props = LinkProps & {
  children?: ReactNode
}

const NavLink = ({ href, children }: Props): JSX.Element => {
  const router = useRouter()
  const linkClass = classNames({ active: router.pathname === href })
  return (
    <>
      <Link href={href}>
        <a className={linkClass}>{children}</a>
      </Link>
      <style jsx>{`
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          font-family: var(--bodyfont);
          font-size: var(--smallsize);
          font-weight: var(--buttonweight);
          text-decoration: none;
          color: var(--inactivelink);
          margin-right: var(--layoutmargin);
        }
        a.active {
          color: var(--activelink);
          border-bottom: 4px solid var(--activelink);
        }
      `}</style>
    </>
  )
}

export default NavLink
