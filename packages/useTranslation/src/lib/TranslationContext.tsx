import { createContext, ReactNode, useState } from 'react'

export const TranslationContext = createContext({ editMode: false, setEditMode: (editMode: boolean) => {} })
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(true)
  return <TranslationContext.Provider value={{ editMode, setEditMode }}>{children}</TranslationContext.Provider>
}
