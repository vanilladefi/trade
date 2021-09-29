import dynamic from 'next/dynamic'

const Image = dynamic(import('next/image'))

type Props = {
  src: string
  injectedStyles?: string
}

export enum IconUrls {
  COPY = '/images/icons/Copy.svg',
  ARROW_UP_RIGHT = '/images/icons/ArrowCircleUpRight.svg',
  CHECK = '/images/icons/check.svg',
  ALERT = '/images/icons/Alert.svg',
}

const Icon: React.FC<Props> = ({ src, injectedStyles }: Props) => {
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
          ${injectedStyles}
        }
      `}</style>
    </div>
  )
}

export default Icon
