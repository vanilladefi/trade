import dynamic from 'next/dynamic'
import { useState } from 'react'

const Image = dynamic(import('next/image'))

export type ImageProps = {
  src: string
  alt?: string
}

const ResponsiveImage: React.FC<ImageProps> = ({ src, alt }: ImageProps) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 })
  return (
    <>
      <div>
        <Image
          src={src}
          layout='responsive'
          objectFit='scale-down'
          width={dimensions.width !== 0 ? dimensions.width : '1'}
          height={`${dimensions.height}px`}
          onLoad={(element) =>
            setDimensions({
              height: element.currentTarget.naturalHeight,
              width: element.currentTarget.naturalWidth,
            })
          }
          alt={alt}
        />
      </div>
      <style jsx>{`
        div {
          display: 'flex';
          position: relative;
          min-height: 1px;
          min-width: 1px;
          height: fit-content;
          max-width: 100%;
          flex-shrink: 1;
        }
      `}</style>
    </>
  )
}

export default ResponsiveImage
