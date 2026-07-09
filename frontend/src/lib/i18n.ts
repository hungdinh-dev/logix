import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import viCommon from '../../public/locales/vi/common.json'
import enCommon from '../../public/locales/en/common.json'

const resources = {
  vi: { common: viCommon },
  en: { common: enCommon },
}

const savedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'vi' : 'vi'

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'vi',
    lng: savedLanguage,
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
}

export default i18n
