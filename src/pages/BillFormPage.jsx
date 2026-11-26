import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { createBill, fetchBill, updateBill } from '../api/bills'
import { fetchSellers } from '../api/sellers'
import { fetchCreditCards } from '../api/creditCards'
import { describeError } from '../utils/errors'
import { fromDateInputValue, toDateInputValue } from '../utils/format'
import BillForm from '../components/BillForm'
import TableSkeleton from '../components/TableSkeleton'
import PageBar from '../components/PageBar'

const EMPTY_BILL = {
  billNumber: '',
  date: '',
  total: '',
  sellerId: '',
  creditCardId: '',
  comment: '',
}

function idToString(value) {
  return value === null || value === undefined ? '' : String(value)
}

function toFormValues(bill) {
  return {
    billNumber: bill.billNumber || '',
    date: toDateInputValue(bill.date),
    total: idToString(bill.total),
    sellerId: idToString(bill.sellerId),
    creditCardId: idToString(bill.creditCardId),
    comment: bill.comment || '',
  }
}

export default function BillFormPage() {
  const { customerId, billId } = useParams()
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { bills, sellers, creditCards, token } = state

  const isEdit = Boolean(billId)
  const fromStore = bills.find((item) => String(item.id) === billId)

  const [fetched, setFetched] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const requestedLookups = useRef(false)
  const requestedBill = useRef(false)
  const billsPath = `/customers/${customerId}/bills`

  useEffect(() => {
    if (!token || requestedLookups.current) return
    if (sellers.length > 0 && creditCards.length > 0) return
    requestedLookups.current = true

    Promise.all([fetchSellers(), fetchCreditCards()])
      .then(([sellerData, cardData]) =>
        dispatch({
          type: actionTypes.LOOKUPS_LOADED,
          payload: { sellers: sellerData, creditCards: cardData },
        }),
      )
      .catch((requestError) => setError(requestError.message))
  }, [creditCards.length, dispatch, sellers.length, token])

  useEffect(() => {
    if (!token || !isEdit || fromStore || requestedBill.current) return
    requestedBill.current = true

    fetchBill(billId)
      .then((data) => setFetched(data))
      .catch((requestError) => setError(requestError.message))
  }, [billId, fromStore, isEdit, token])

  const record = fromStore || fetched

  async function handleSubmit(values) {
    setSubmitting(true)
    setError(null)

    const edits = {
      billNumber: values.billNumber.trim(),
      date: fromDateInputValue(values.date),
      total: Number(values.total),
      customerId: Number(customerId),
      sellerId: values.sellerId === '' ? null : Number(values.sellerId),
      creditCardId:
        values.creditCardId === '' ? null : Number(values.creditCardId),
      comment: values.comment.trim(),
    }

    try {
      if (isEdit) {
        const saved = await updateBill(billId, { ...record, ...edits })
        dispatch({ type: actionTypes.BILL_UPDATED, payload: saved })
      } else {
        const created = await createBill(edits)
        dispatch({ type: actionTypes.BILL_CREATED, payload: created })
      }

      navigate(billsPath)
    } catch (requestError) {
      setError(describeError(requestError))
      setSubmitting(false)
    }
  }

  const title = isEdit ? 'Edit bill' : 'New bill'

  if (!token) {
    return (
      <>
        <PageBar title={title} />
        <main className="container py-4">
          <div className="panel p-4">
            <p className="page-subtitle mb-3">
              Managing bills is only available to signed-in users.
            </p>
            <Link className="btn btn-primary" to="/login">
              Sign in
            </Link>
          </div>
        </main>
      </>
    )
  }

  if (isEdit && !record) {
    return (
      <>
        <PageBar title={title} backTo={billsPath} backLabel="Back to bills" />
        <main className="container py-4">
          <div className="panel">
            <TableSkeleton rows={3} columns={2} />
          </div>
          <span className="visually-hidden">Loading bill…</span>
        </main>
      </>
    )
  }

  return (
    <>
      <PageBar title={title} backTo={billsPath} backLabel="Back to bills" />

      <main className="container py-4">
        <div className="panel p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <BillForm
            key={record ? record.id : 'new'}
            initialValues={record ? toFormValues(record) : EMPTY_BILL}
            sellers={sellers}
            creditCards={creditCards}
            submitting={submitting}
            submitLabel={isEdit ? 'Save changes' : 'Create bill'}
            cancelTo={billsPath}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  )
}
