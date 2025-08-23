import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MswProvider } from './msw-provider'
import { QueryProvider } from './query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chordially',
  description: 'A Tinder for Music',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <MswProvider>
          <QueryProvider>{children}</QueryProvider>
        </MswProvider>
      </body>
    </html>
  )
}
