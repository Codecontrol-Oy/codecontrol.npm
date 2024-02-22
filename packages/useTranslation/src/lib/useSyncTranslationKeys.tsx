import { useTranslation } from './useTranslation'

interface NamespaceKeys {
  keys: Record<string, string>
}
interface Namespaces {
  namespaces: Record<string, NamespaceKeys>
}
interface SyncKeysOptions {
  request: () => Promise<Namespaces>
}
export default function useSyncTranslationKeys() {
  const { i18n } = useTranslation()
  const syncKeys = (opts: SyncKeysOptions) => {
    opts.request().then((namespaces) => {
      console.log({ namespaces })
    })
  }

  return syncKeys
}
