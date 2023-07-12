import { ReactNode } from 'react'
import styles from './error-page.module.css'

interface ErrorPageTranslations {
  header?: string | ReactNode
  paragraph?: string | ReactNode
}
interface ErrorPageProps {
  image?: string
  translation?: ErrorPageTranslations
}

const defaultTranslations: ErrorPageTranslations = {
  header: 'Hups, sivulla tapahtui odottamaton virhe',
  paragraph: 'Lataa sivu uudelleen tai palaa etusivulle korjataksesi ongelman',
}
export function ErrorPage({ image, translation = defaultTranslations }: ErrorPageProps = {}) {
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
      {image && <img src={image} alt='Error' />}
    </div>
  )
}
