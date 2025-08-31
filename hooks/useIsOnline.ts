'use client'

import { useEffect, useState } from 'react'
import { onlineManager } from '@tanstack/react-query'

export function useIsOnline() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(onlineManager.isOnline())

    return onlineManager.subscribe(() => {
      setIsOnline(onlineManager.isOnline())
    })
  }, [])

  return isOnline
}
