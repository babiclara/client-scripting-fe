export const actionTypes = {
  LOAD_START: 'customers/loadStart',
  LOAD_SUCCESS: 'customers/loadSuccess',
  LOAD_FAILURE: 'customers/loadFailure',
  SET_SEARCH: 'customers/setSearch',
  SET_SORT: 'customers/setSort',
  SET_PAGE_SIZE: 'customers/setPageSize',
  SET_PAGE: 'customers/setPage',
}

export const initialState = {
  customers: [],
  cities: [],
  status: 'idle',
  error: null,
  search: '',
  sortBy: 'surname',
  sortDir: 'asc',
  pageSize: 10,
  page: 1,
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
      return { ...state, search: action.payload, page: 1 }

    case actionTypes.SET_SORT: {
      const column = action.payload
      const sameColumn = state.sortBy === column
      const sortDir = sameColumn && state.sortDir === 'asc' ? 'desc' : 'asc'
      return { ...state, sortBy: column, sortDir, page: 1 }
    }

    case actionTypes.SET_PAGE_SIZE:
      return { ...state, pageSize: action.payload, page: 1 }

    case actionTypes.SET_PAGE:
      return { ...state, page: action.payload }

    default:
      return state
  }
}
