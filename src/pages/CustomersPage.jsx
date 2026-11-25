import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { fetchCustomers } from '../api/customers'
import { fetchCities } from '../api/cities'
import {
  attachCityNames,
  buildCityLookup,
  countPages,
  describeRange,
  filterCustomers,
  paginate,
  sortCustomers,
} from '../utils/customerTools'
import SearchBox from '../components/SearchBox'
import PageSizeSelect from '../components/PageSizeSelect'
import CustomerTable from '../components/CustomerTable'
import Pagination from '../components/Pagination'
import TableSkeleton from '../components/TableSkeleton'
import PageBar from '../components/PageBar'

export default function CustomersPage() {
  const { state, dispatch } = useApp()
  const {
    customers,
    cities,
    status,
    error,
    search,
    sortBy,
    sortDir,
    page,
    pageSize,
    token,
  } = state

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
  const ordered = useMemo(
    () => sortCustomers(matching, sortBy, sortDir),
    [matching, sortBy, sortDir],
  )

  const totalPages = countPages(ordered.length, pageSize)
  const currentPage = Math.min(page, totalPages)
  const visible = useMemo(
    () => paginate(ordered, currentPage, pageSize),
    [ordered, currentPage, pageSize],
  )

  if (status === 'loading' || status === 'idle') {
    return (
      <>
        <PageBar title="Customers" />
        <main className="container py-4">
          <div className="panel">
            <TableSkeleton rows={8} columns={5} />
          </div>
          <span className="visually-hidden">Loading customers…</span>
        </main>
      </>
    )
  }

  if (status === 'error') {
    return (
      <>
        <PageBar title="Customers" />
        <main className="container py-4">
          <div className="alert alert-danger">
            <strong>Could not load customers.</strong> {error}
            <div className="small mt-1">
              Make sure the backend is running on http://localhost:3000.
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <PageBar
        title="Customers"
        pills={[`${ordered.length} of ${rows.length}`]}
        action={
          token !== null && (
            <Link className="btn btn-primary" to="/customers/new">
              New customer
            </Link>
          )
        }
      />

      <main className="container py-4">
        <div className="panel">
        <div className="panel-controls">
          <div className="controls-row">
            <SearchBox
              value={search}
              onChange={(value) =>
                dispatch({ type: actionTypes.SET_SEARCH, payload: value })
              }
            />
            <PageSizeSelect
              value={pageSize}
              onChange={(value) =>
                dispatch({ type: actionTypes.SET_PAGE_SIZE, payload: value })
              }
            />
          </div>
        </div>

        <CustomerTable
          rows={visible}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={(column) =>
            dispatch({ type: actionTypes.SET_SORT, payload: column })
          }
          canViewBills={token !== null}
        />

        <div className="panel-footer">
          <span className="footer-range">
            {describeRange(currentPage, pageSize, ordered.length)}
          </span>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(nextPage) =>
              dispatch({ type: actionTypes.SET_PAGE, payload: nextPage })
            }
          />
        </div>
        </div>
      </main>
    </>
  )
}
