import { useEffect, useMemo, useRef } from 'react'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { fetchCustomers } from '../api/customers'
import { fetchCities } from '../api/cities'
import {
  attachCityNames,
  buildCityLookup,
  filterCustomers,
} from '../utils/customerTools'
import SearchBox from '../components/SearchBox'
import CustomerTable from '../components/CustomerTable'

export default function CustomersPage() {
  const { state, dispatch } = useApp()
  const { customers, cities, status, error, search } = state

  const requested = useRef(false)

  useEffect(() => {
    if (requested.current) return
    requested.current = true

    async function load() {
      dispatch({ type: actionTypes.LOAD_START })

      try {
        const [customerData, cityData] = await Promise.all([
          fetchCustomers(),
          fetchCities(),
        ])

        dispatch({
          type: actionTypes.LOAD_SUCCESS,
          payload: { customers: customerData, cities: cityData },
        })
      } catch (requestError) {
        dispatch({
          type: actionTypes.LOAD_FAILURE,
          payload: requestError.message,
        })
      }
    }

    load()
  }, [dispatch])

  const rows = useMemo(
    () => attachCityNames(customers, buildCityLookup(cities)),
    [customers, cities],
  )

  const matching = useMemo(() => filterCustomers(rows, search), [rows, search])

  if (status === 'loading' || status === 'idle') {
    return <p className="text-secondary">Loading customers…</p>
  }

  if (status === 'error') {
    return (
      <div className="alert alert-danger">
        <strong>Could not load customers.</strong> {error}
        <div className="small mt-1">
          Make sure the backend is running on http://localhost:3000.
        </div>
      </div>
    )
  }

  return (
    <section>
      <header className="mb-3">
        <h1 className="h3 mb-1">Customers</h1>
        <p className="text-secondary mb-0">
          {matching.length} of {rows.length} customers
        </p>
      </header>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-7 col-lg-6">
          <SearchBox
            value={search}
            onChange={(value) =>
              dispatch({ type: actionTypes.SET_SEARCH, payload: value })
            }
          />
        </div>
      </div>

      <CustomerTable rows={matching} />
    </section>
  )
}
