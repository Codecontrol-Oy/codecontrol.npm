import { ComponentType } from 'react'
import { useLocation } from 'react-router-dom'
import WithLocationProps from '../interfaces/WithLocationProps'


export default function withLocation<T extends WithLocationProps = WithLocationProps>(WrappedComponent: ComponentType<T>) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  const ComponentWithHistory = (props: Omit<T, keyof WithLocationProps>) => {
    return <WrappedComponent {...props as T} location={useLocation()} />
  }

  ComponentWithHistory.displayName = `withHistory(${displayName})`
  return ComponentWithHistory
}


