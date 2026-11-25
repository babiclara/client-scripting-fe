export const actionTypes = {
  LOAD_START: 'customers/loadStart',
  LOAD_SUCCESS: 'customers/loadSuccess',
  LOAD_FAILURE: 'customers/loadFailure',
  SET_SEARCH: 'customers/setSearch',
}

export const initialState = {
  customers: [],
  cities: [],
  status: 'idle',
  error: null,
  search: '',
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

    case actionTypes.SET_SEARCH:
      return { ...state, search: action.payload }

    default:
      return state
  }
}
