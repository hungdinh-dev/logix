'use client'

import { useEffect, useState, type ComponentProps } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from './query-client'
import i18n from './i18n' // Initialize i18n config

function SafeThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider {...props} enableSystem={mounted ? false : props.enableSystem}>
      {children}
    </NextThemesProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng')
    if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
      if (i18n.language !== savedLang) {
        i18n.changeLanguage(savedLang)
      }
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <SafeThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </TooltipProvider>
      </SafeThemeProvider>
    </QueryClientProvider>
  )
}
