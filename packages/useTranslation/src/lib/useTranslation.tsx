import { useTranslation as useT } from 'react-i18next'
import { MouseEvent, useContext } from 'react'
import { TranslationContext } from './TranslationContext'
export function useTranslation() {
  const { editMode } = useContext(TranslationContext)
  const { t: translation, i18n } = useT()
  const edit = (event: MouseEvent<HTMLSpanElement>, key: string, options: any) => {
    event.stopPropagation()
    alert(`edit, key: ${key}, options: ${options}`)
  }
  const t = (key: string, options?: any) => {
    const text = translation(key, options)
    if (!editMode) return `${text}`
    return <span style={{ backgroundColor: 'salmon' }} onClick={(event) => edit(event, key, options)}>{`${text}`}</span>
  }
  return { t, i18n }
}
