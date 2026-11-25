import { useContext } from 'react'
import { AppContext } from './appContext'

export function useApp() {
  const context = useContext(AppContext)

  if (context === null) {
    throw new Error('useApp() must be called inside an <AppProvider>')
  }

  return context
}
