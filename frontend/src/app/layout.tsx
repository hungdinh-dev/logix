import type { Metadata } from 'next'
import { DM_Sans, Lora, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/lib/providers'
import NextTopLoader from 'nextjs-toploader'
import './index.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'LogiX',
    template: '%s | LogiX',
  },
  description: 'Hệ thống quản lý quan hệ khách hàng LogiX',
  // icons: {
  //   icon: '/logo/Logo-DigiOne.png',
  //   shortcut: '/logo/Logo-DigiOne.png',
  //   apple: '/logo/Logo-DigiOne.png',
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      className={`${dmSans.variable} ${lora.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <NextTopLoader
          color="#e8784a"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #e8784a, 0 0 5px #e8784a"
          zIndex={99999}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

