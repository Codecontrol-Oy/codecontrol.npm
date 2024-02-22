import InitializeTranslationOptions from '../types/initializeTranslationOptions'
import i18next from 'i18next'
import I18NextHttpBackend, { HttpBackendOptions } from 'i18next-http-backend/cjs'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { useState } from 'react'

export function useInitializeTranslations() {
  const [initialized, setInitialized] = useState(false)
  function initializeTranslations(opts: InitializeTranslationOptions) {
    i18next
      .use(initReactI18next)
      .use(I18NextHttpBackend)
      .use(I18nextBrowserLanguageDetector)
      .init<HttpBackendOptions>({
        backend: {
          withCredentials: opts.withCredentials ?? true,
          crossDomain: opts.crossDomain ?? true,
          addPath: opts.addPath,
          loadPath: opts.loadPath,
        },
        lng: opts.defaultLanguage,
        fallbackLng: opts.fallbackLanguage,
        supportedLngs: opts.supportedLanguages,
        defaultNS: opts.defaultNS,
        ns: opts.ns ?? [opts.defaultNS],
        load: 'languageOnly',
        detection: {
          order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator'],
        },
      })
      .then(async () => {
        console.log('initialized')

        setInitialized(true)
      })
  }
  return { initializeTranslations, initialized }
}
