interface ErrorBoundaryTestProps {
  suppressError?: boolean
}

export default function ErrorBoundaryTest({ suppressError = false }: ErrorBoundaryTestProps) {
  if (!suppressError) throw new Error('Apua errori')
  return (
    <div>
      <h1>TESTIOSIO</h1>
    </div>
  )
}
