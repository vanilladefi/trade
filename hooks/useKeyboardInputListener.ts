import { useEffect } from 'react'

function useKeyboardInputListener(
  keyEvent: string | string[],
  callback: () => void,
): void {
  const listener = (e: KeyboardEvent) => {
    if (e.key === keyEvent) {
      callback()
    }
  }
  const matchingListener = (e: KeyboardEvent) => {
    if (keyEvent.includes(e.key)) {
      callback()
    }
  }
  return useEffect(() => {
    document.addEventListener(
      'keydown',
      keyEvent instanceof Array ? matchingListener : listener,
    )
    return () => {
      document.removeEventListener(
        'keydown',
        keyEvent instanceof Array ? matchingListener : listener,
      )
    }
  })
}

export default useKeyboardInputListener
