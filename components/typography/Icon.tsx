import Image from 'next/image'

type Props = {
  src: string
}

export enum IconUrls {
  COPY = '/images/icons/Copy.png',
  ARROW_UP_RIGHT = '/images/icons/ArrowCircleUpRight.png',
}

const Icon = ({ src }: Props): JSX.Element => {
  return (
    <div>
      <Image src={src} height='1rem' width='1rem' layout='fixed' />
      <style jsx>{`
        div {
          margin-right: 0.33rem;
        }
      `}</style>
    </div>
  )
}

export default Icon
