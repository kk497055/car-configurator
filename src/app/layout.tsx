import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3D Car Configurator',
  description: 'Customize your car with wraps and decals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
