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
          width: 100%;
          font-size: var(--mobilenavlinksize);
          color: var(--inactivelink);
          text-decoration: none;
          padding: 1rem 0;
        }
        a.active {
          color: var(--activelink);
        }
        @media (min-width: 680px) {
          a {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            border-top: 4px solid transparent;
            border-bottom: 4px solid transparent;
            font-family: var(--bodyfont);
            font-size: var(--bodysize);
            font-weight: var(--buttonweight);
            padding: 1rem 0rem;
            width: auto;
            margin-right: 3rem;
          }
          a.active {
            border-bottom: var(--activelinkborder);
          }
        }
      `}</style>
    </>
  )
}

export default NavLink
