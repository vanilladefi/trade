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
      <Image src={src} layout='fill' />
      <style jsx>{`
        div {
          display: flex;
          position: relative;
          flex-shrink: 0;
          height: 1rem;
          width: 1rem;
          margin-right: 0.33rem;
        }
      `}</style>
    </div>
  )
}

export default Icon
