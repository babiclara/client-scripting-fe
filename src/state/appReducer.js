export const actionTypes = {
  LOAD_START: 'customers/loadStart',
  LOAD_SUCCESS: 'customers/loadSuccess',
  LOAD_FAILURE: 'customers/loadFailure',
  SET_SEARCH: 'customers/setSearch',
  SET_SORT: 'customers/setSort',
  SET_PAGE_SIZE: 'customers/setPageSize',
  SET_PAGE: 'customers/setPage',
  LOGIN_SUCCESS: 'auth/loginSuccess',
  LOGIN_FAILURE: 'auth/loginFailure',
  LOGOUT: 'auth/logout',
  BILLS_LOAD_START: 'bills/loadStart',
  BILLS_LOAD_SUCCESS: 'bills/loadSuccess',
  BILLS_LOAD_FAILURE: 'bills/loadFailure',
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
  token: null,
  userEmail: null,
  authError: null,
  bills: [],
  billsCustomer: null,
  billsStatus: 'idle',
  billsError: null,
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

    case actionTypes.LOGIN_SUCCESS: {
      const { token, email } = action.payload
      return { ...state, token, userEmail: email, authError: null }
    }

    case actionTypes.LOGIN_FAILURE:
      return { ...state, token: null, userEmail: null, authError: action.payload }

    case actionTypes.LOGOUT:
      return { ...state, token: null, userEmail: null, authError: null }

    case actionTypes.BILLS_LOAD_START:
      return { ...state, billsStatus: 'loading', billsError: null }

    case actionTypes.BILLS_LOAD_SUCCESS: {
      const { bills, customer } = action.payload
      return { ...state, billsStatus: 'ready', bills, billsCustomer: customer }
    }

    case actionTypes.BILLS_LOAD_FAILURE:
      return { ...state, billsStatus: 'error', billsError: action.payload }

    default:
      return state
  }
}
