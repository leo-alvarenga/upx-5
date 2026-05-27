import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from './resources/pt-BR'
import enUS from './resources/en-US'

const STORAGE_KEY = 'micromanager-language'

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        'pt-BR': { translation: ptBR },
        'en-US': { translation: enUS },
      },
      lng: 'pt-BR', // Default language
      fallbackLng: 'pt-BR',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
    })
}

// Export function to change language and persist preference
export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang)
    // Update HTML lang attribute
    document.documentElement.lang = lang
  }
}

export default i18n
