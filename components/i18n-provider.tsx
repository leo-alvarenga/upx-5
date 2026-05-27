'use client'

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

const STORAGE_KEY = 'micromanager-language'
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'pt-BR'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Read saved language from localStorage and sync with i18n
    const savedLanguage = localStorage.getItem(STORAGE_KEY) || DEFAULT_LOCALE
    
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage).then(() => {
        setIsReady(true)
      })
    } else {
      setIsReady(true)
    }

    // Update HTML lang attribute
    document.documentElement.lang = savedLanguage
  }, [])

  // Don't render children until i18n is synchronized
  if (!isReady) {
    return null
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
