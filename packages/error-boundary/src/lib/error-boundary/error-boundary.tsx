import { Component, ErrorInfo, ReactNode } from 'react'
import type { Location } from 'react-router-dom'
import WithLocationProps from '../interfaces/WithLocationProps'
import withLocation from '../helpers/withHistory'
import { ErrorPage } from './error-page'

interface ErrorBoundaryProps extends WithLocationProps {
  children: ReactNode
  onError?: (error: Error, locationHistory: Location[]) => void
  locationHistorySize?: number
  errorPage?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  locationHistory: Location[]
}

class ErrorBoundaryBase extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static defaultProps: Partial<ErrorBoundaryProps>
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, locationHistory: [] }
  }

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    if (this.props.onError) this.props.onError(error, this.state.locationHistory)
  }

  componentDidMount() {
    this.setState({ ...this.state, locationHistory: [this.props.location, ...this.state.locationHistory] })
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>, prevState: Readonly<ErrorBoundaryState>, snapshot?: any) {
    const {
      pathname: currentPathname,
      state: currentState,
      key: currentKey,
      search: currentSearch,
    } = this.props.location
    const {
      pathname: previousPathname,
      state: previousState,
      key: previousKey,
      search: previousSearch,
    } = prevProps.location

    if (
      currentPathname === previousPathname &&
      currentState === previousState &&
      currentKey === previousKey &&
      currentSearch === previousSearch
    )
      return

    const locationHistory = [
      this.props.location,
      ...this.state.locationHistory.slice(0, (this.props.locationHistorySize ?? LOCATION_HISTORY_DEFAULT_SIZE) - 1),
    ]
    this.setState({
      ...this.state,
      hasError: false,
      locationHistory,
    })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />
    }

    return <div>{this.props.children}</div>
  }
}

const LOCATION_HISTORY_DEFAULT_SIZE = 100
ErrorBoundaryBase.defaultProps = {
  locationHistorySize: LOCATION_HISTORY_DEFAULT_SIZE,
}
export const ErrorBoundary = withLocation(ErrorBoundaryBase)
