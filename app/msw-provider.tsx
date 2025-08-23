'use client'

import { ReactNode, useEffect, useState } from 'react'

export function MswProvider({ children }: { children: ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const initMsw = async () => {
        const { worker } = await import('@/lib/msw/browser')
        await worker.start()
        setMswReady(true)
      }

      if (!mswReady) {
        initMsw()
      }
    }
  }, [mswReady])

  return <>{children}</>
}
