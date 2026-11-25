import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { deleteBill, fetchBillsByCustomer } from '../api/bills'
import { fetchCustomer } from '../api/customers'
import { formatMoney, sumAmounts } from '../utils/format'
import BillTable from '../components/BillTable'
import TableSkeleton from '../components/TableSkeleton'
import PageBar from '../components/PageBar'
import ConfirmDialog from '../components/ConfirmDialog'

export default function BillsPage() {
  const { customerId } = useParams()
  const { state, dispatch } = useApp()
  const { bills, billsCustomer, billsStatus, billsError, token } = state

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

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

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)

    try {
      await deleteBill(pendingDelete.id)
      dispatch({ type: actionTypes.BILL_DELETED, payload: pendingDelete.id })
      setPendingDelete(null)
    } catch (requestError) {
      setDeleteError(
        requestError.response?.data?.message || requestError.message,
      )
    }

    setDeleting(false)
  }

  function closeDialog() {
    setPendingDelete(null)
    setDeleteError(null)
  }

  if (!token) {
    return (
      <>
        <PageBar title="Bills" />
        <main className="container py-4">
          <div className="panel p-4">
            <p className="page-subtitle mb-3">
              Bills are only available to signed-in users.
            </p>
            <Link className="btn btn-primary" to="/login">
              Sign in
            </Link>
          </div>
        </main>
      </>
    )
  }

  if (billsStatus === 'loading' || billsStatus === 'idle') {
    return (
      <>
        <PageBar title="Bills" />
        <main className="container py-4">
          <div className="panel">
            <TableSkeleton rows={6} columns={4} />
          </div>
          <span className="visually-hidden">Loading bills…</span>
        </main>
      </>
    )
  }

  if (billsStatus === 'error') {
    return (
      <>
        <PageBar title="Bills" />
        <main className="container py-4">
          <div className="alert alert-danger">
            <strong>Could not load bills.</strong> {billsError}
          </div>
        </main>
      </>
    )
  }

  const customerName = billsCustomer
    ? `${billsCustomer.name} ${billsCustomer.surname}`
    : 'Customer'

  return (
    <>
      <PageBar
        title={customerName}
        pills={[
          `${bills.length} bills`,
          formatMoney(sumAmounts(bills, 'total')),
        ]}
        backTo="/customers"
        backLabel="All customers"
        action={
          <Link className="btn btn-primary" to={`/customers/${customerId}/bills/new`}>
            New bill
          </Link>
        }
      />

      <main className="container py-4">
        <div className="panel">
          <BillTable
            rows={bills}
            customerId={customerId}
            onDelete={setPendingDelete}
          />
        </div>
      </main>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete bill"
          message={`Delete bill ${pendingDelete.billNumber}? This cannot be undone, and its items will be left without a bill.`}
          confirmLabel="Delete"
          busy={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={closeDialog}
        />
      )}
    </>
  )
}
