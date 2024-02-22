import { Link, Route, Routes } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import ErrorBoundaryTest from '../pages/errorBoundaryTest'
import UploadTest from '../pages/uploadTest'
import { CCErrorBoundary, CCErrorPage } from '@codecontrol/error-boundary'
import TranslationTest from '../pages/tranlationTest'
import { useEffect } from 'react'
import { TranslationProvider, useInitializeTranslations } from '@codecontrol/useTranslation'

export function App() {
  const { initializeTranslations, initialized } = useInitializeTranslations()
  useEffect(() => {
    initializeTranslations({
      defaultLanguage: 'fi',
      fallbackLanguage: 'fi',
      loadPath: 'http://localhost:3000/locales/{{lng}}/{{ns}}',
      addPath: '/locales/add/{{lng}}/{{ns}}',
      supportedLanguages: ['fi', 'en'],
      defaultNS: 'translations',
    })
  }, [initializeTranslations])
  const routes = [
    {
      to: 'error-boundary-test',
      element: <ErrorBoundaryTest />,
      label: 'Error boundary test',
    },
    {
      to: 'file-upload-test',
      element: <UploadTest />,
      label: 'File upload test',
    },
    {
      to: 'tranlation-test',
      element: <TranslationTest />,
      label: 'Tranlation test',
    },
    {
      to: 'empty-page-test',
      element: <div>Empty</div>,
      label: 'Empty',
    },
  ]
  const handleError = (error: Error, locationHistory: Location[]) => {
    // eslint-disable-next-line no-console
    console.log({ error, locationHistory })
  }
  if (!initialized) return <>Loading</>
  return (
    <div>
      <div role='navigation'>
        <ul>
          {routes.map((route) => (
            <li key={route.to}>
              <Link to={route.to}>{route.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <CCErrorBoundary
        onError={handleError}
        errorPage={<CCErrorPage translation={{ header: 'Whoops error', paragraph: 'Oh no' }} />}
      >
        <TranslationProvider>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.to} element={route.element} />
            ))}
          </Routes>
        </TranslationProvider>
      </CCErrorBoundary>
    </div>
  )
}

export default App
