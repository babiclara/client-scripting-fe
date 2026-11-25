import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { fetchBillsByCustomer } from '../api/bills'
import { fetchCustomer } from '../api/customers'
import { formatMoney, sumAmounts } from '../utils/format'
import BillTable from '../components/BillTable'

export default function BillsPage() {
  const { customerId } = useParams()
  const { state, dispatch } = useApp()
  const { bills, billsCustomer, billsStatus, billsError, token } = state

  const loadedFor = useRef(null)

  useEffect(() => {
    if (!token) return
    if (loadedFor.current === customerId) return
    loadedFor.current = customerId

    async function load() {
      dispatch({ type: actionTypes.BILLS_LOAD_START })

      try {
        const [billData, customer] = await Promise.all([
          fetchBillsByCustomer(customerId),
          fetchCustomer(customerId),
        ])

        dispatch({
          type: actionTypes.BILLS_LOAD_SUCCESS,
          payload: { bills: billData, customer },
        })
      } catch (requestError) {
        dispatch({
          type: actionTypes.BILLS_LOAD_FAILURE,
          payload: requestError.message,
        })
      }
    }

    load()
  }, [customerId, dispatch, token])

  if (!token) {
    return (
      <section>
        <h1 className="h3 mb-2">Bills</h1>
        <p className="text-secondary">
          Bills are only available to signed-in users.
        </p>
        <Link className="btn btn-primary" to="/login">
          Sign in
        </Link>
      </section>
    )
  }

  if (billsStatus === 'loading' || billsStatus === 'idle') {
    return <p className="text-secondary">Loading bills…</p>
  }

  if (billsStatus === 'error') {
    return (
      <div className="alert alert-danger">
        <strong>Could not load bills.</strong> {billsError}
      </div>
    )
  }

  const customerName = billsCustomer
    ? `${billsCustomer.name} ${billsCustomer.surname}`
    : 'Customer'

  return (
    <section>
      <Link to="/customers">&larr; All customers</Link>

      <header className="mb-3 mt-2">
        <h1 className="h3 mb-1">{customerName}</h1>
        <p className="text-secondary mb-0">
          {bills.length} bills, {formatMoney(sumAmounts(bills, 'total'))} in
          total
        </p>
      </header>

      <BillTable rows={bills} />
    </section>
  )
}
