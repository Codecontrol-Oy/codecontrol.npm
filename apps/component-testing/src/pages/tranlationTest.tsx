import { useTranslation } from '@codecontrol/useTranslation'

export default function TranslationTest() {
  const { t, i18n } = useTranslation()
  return (
    <div>
      <button onClick={() => (i18n.language === 'fi' ? i18n.changeLanguage('en') : i18n.changeLanguage('fi'))}>
        {t('changeLanguage')}
      </button>
      <br />
      {t('frontPage_Title')}
      <br />
      {t('testi')}
    </div>
  )
}
