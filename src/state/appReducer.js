export const actionTypes = {
  LOAD_START: 'customers/loadStart',
  LOAD_SUCCESS: 'customers/loadSuccess',
  LOAD_FAILURE: 'customers/loadFailure',
}

export const initialState = {
  customers: [],
  cities: [],
  status: 'idle',
  error: null,
}

export function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_START:
      return { ...state, status: 'loading', error: null }

    case actionTypes.LOAD_SUCCESS: {
      const { customers, cities } = action.payload
      return { ...state, status: 'ready', customers, cities }
    }

    case actionTypes.LOAD_FAILURE:
      return { ...state, status: 'error', error: action.payload }

    default:
      return state
  }
}
