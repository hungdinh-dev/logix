'use client'

import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from './query-client'
import i18n from './i18n' // Initialize i18n config

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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
