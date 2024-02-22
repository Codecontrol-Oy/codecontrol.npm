export default interface InitializeTranslationOptions {
  defaultLanguage: string
  fallbackLanguage: string
  loadPath: string
  addPath: string
  supportedLanguages: string[]
  defaultNS: string
  ns?: string[]
  crossDomain?: boolean
  withCredentials?: boolean
}
