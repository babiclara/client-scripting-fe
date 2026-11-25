import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { createBill } from '../api/bills'
import { fetchSellers } from '../api/sellers'
import { fetchCreditCards } from '../api/creditCards'
import { fromDateInputValue } from '../utils/format'
import BillForm from '../components/BillForm'
import PageBar from '../components/PageBar'

const EMPTY_BILL = {
  billNumber: '',
  date: '',
  total: '',
  sellerId: '',
  creditCardId: '',
  comment: '',
}

export default function BillFormPage() {
  const { customerId } = useParams()
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { sellers, creditCards, token } = state

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const requestedLookups = useRef(false)
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

  async function handleSubmit(values) {
    setSubmitting(true)
    setError(null)

    const payload = {
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
      const created = await createBill(payload)
      dispatch({ type: actionTypes.BILL_CREATED, payload: created })
      navigate(billsPath)
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <>
        <PageBar title="New bill" />
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

  return (
    <>
      <PageBar title="New bill" backTo={billsPath} backLabel="Back to bills" />

      <main className="container py-4">
        <div className="panel p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <BillForm
            initialValues={EMPTY_BILL}
            sellers={sellers}
            creditCards={creditCards}
            submitting={submitting}
            submitLabel="Create bill"
            cancelTo={billsPath}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  )
}
