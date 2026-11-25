import { useReducer } from 'react'
import PropTypes from 'prop-types'
import { AppContext } from './appContext'
import { appReducer, initialState } from './appReducer'

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
