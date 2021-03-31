import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function InViewWrapper(
  props: React.PropsWithChildren<{
    className?: string
    delay?: number
  }>,
): React.ReactElement {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.65 })

  const BoxVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.5,
        delay: props.delay ? props.delay : 0,
      },
    },
    hidden: { opacity: 0, y: 26 },
  }

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial='hidden'
      variants={BoxVariants}
    >
      {props.children}{' '}
    </motion.div>
  )
}
