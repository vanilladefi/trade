import Image from 'next/image'

type Props = {
  src: string
}

export enum IconUrls {
  COPY = '/images/icons/Copy.svg',
  ARROW_UP_RIGHT = '/images/icons/ArrowCircleUpRight.svg',
  CHECK = '/images/icons/check.svg',
  ALERT = '/images/icons/Alert.svg',
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
          height: var(--iconsize);
          width: var(--iconsize);
          margin-right: 0.33rem;
        }
      `}</style>
    </div>
  )
}

export default Icon
