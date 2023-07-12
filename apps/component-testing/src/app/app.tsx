import { Link, Route, Routes } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import ErrorBoundaryTest from '../pages/errorBoundaryTest'
import UploadTest from '../pages/uploadTest'
import { CCErrorBoundary, CCErrorPage } from '@codecontrol/error-boundary'

export function App() {
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
      to: 'empty-page-test',
      element: <div>Empty</div>,
      label: 'Empty',
    },
  ]
  const handleError = (error: Error, locationHistory: Location[]) => {
    // eslint-disable-next-line no-console
    console.log({ error, locationHistory })
  }
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
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.to} element={route.element} />
          ))}
        </Routes>
      </CCErrorBoundary>
    </div>
  )
}

export default App
