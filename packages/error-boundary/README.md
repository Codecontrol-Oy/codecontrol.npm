# @codecontrol/error-boundary
Simple error boundary component. Handles unexpected errors by showing error page instead of the default white page. onError handler provides error and location history for logging.
## Usage
Wrap ``react-router-dom`` ``<Routes>`` component with ``<ErrorBoundary>``.

```tsx
<CCErrorBoundary onError={handleError}>
  <Routes>
    <Route path={'/users'} element={<UserManagementPage />} />
  </Routes>
</CCErrorBoundary>
```

## Translations
Replace the errorPage prop with your custom error page or use ``<CCErrorPage />`` component and provide it translations

```tsx
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
```