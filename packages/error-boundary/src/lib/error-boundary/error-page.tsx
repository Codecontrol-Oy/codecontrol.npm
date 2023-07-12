import { ReactNode } from 'react'
import styles from './error-page.module.css'

interface ErrorPageTranslations {
  header?: string | ReactNode
  paragraph?: string | ReactNode
}
interface ErrorPageProps {
  translation?: ErrorPageTranslations
}

const defaultTranslations: ErrorPageTranslations = {
  header: 'Whoops, it seems we have encountered unexpected error',
  paragraph: 'Go back or reload site to try fixing the problem',
}

export function CCErrorPage({ translation = defaultTranslations }: ErrorPageProps = {}) {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        {typeof translation?.header === 'string' ? (
          <h1 className={styles.header}>{translation?.header}</h1>
        ) : (
          translation?.header
        )}
        {typeof translation?.paragraph === 'string' ? (
          <p className={styles.paragraph}>{translation?.paragraph}</p>
        ) : (
          translation?.paragraph
        )}
      </div>
    </div>
  )
}
