## Getting started
Wrap react-router-dom Routes component with errorboundary.

```tsx
<ErrorBoundary onError={handleError}>
  <Routes>
    <Route path={'/users'} element={<UserManagementPage />} />
  </Routes>
</ErrorBoundary>
```