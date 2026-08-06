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
    default: 'DigiFNB CRM',
    template: '%s | DigiFNB CRM',
  },
  description: 'Hệ thống quản lý quan hệ khách hàng DigiFNB',
  icons: {
    icon: '/logo/Logo-DigiOne.png',
    shortcut: '/logo/Logo-DigiOne.png',
    apple: '/logo/Logo-DigiOne.png',
  },
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
          color="var(--primary)"
          showSpinner={false}
          height={3}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

