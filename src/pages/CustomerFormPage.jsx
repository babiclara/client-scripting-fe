import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import {
  createCustomer,
  fetchCustomer,
  updateCustomer,
} from '../api/customers'
import { fetchCities } from '../api/cities'
import { describeError } from '../utils/errors'
import CustomerForm from '../components/CustomerForm'
import TableSkeleton from '../components/TableSkeleton'
import PageBar from '../components/PageBar'

const EMPTY_CUSTOMER = {
  name: '',
  surname: '',
  email: '',
  telephone: '',
  cityId: '',
}

function toFormValues(customer) {
  return {
    name: customer.name || '',
    surname: customer.surname || '',
    email: customer.email || '',
    telephone: customer.telephone || '',
    cityId: customer.cityId === null ? '' : String(customer.cityId),
  }
}

export default function CustomerFormPage() {
  const { customerId } = useParams()
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { cities, customers, token } = state

  const isEdit = Boolean(customerId)
  const fromStore = customers.find((item) => String(item.id) === customerId)

  const [fetched, setFetched] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const requestedCities = useRef(false)
  const requestedCustomer = useRef(false)

  useEffect(() => {
    if (cities.length > 0 || requestedCities.current) return
    requestedCities.current = true

    fetchCities()
      .then((data) =>
        dispatch({ type: actionTypes.CITIES_LOADED, payload: data }),
      )
      .catch((requestError) => setError(requestError.message))
  }, [cities.length, dispatch])

  useEffect(() => {
    if (!isEdit || fromStore || requestedCustomer.current) return
    requestedCustomer.current = true

    fetchCustomer(customerId)
      .then((data) => setFetched(data))
      .catch((requestError) => setError(requestError.message))
  }, [customerId, fromStore, isEdit])

  const record = fromStore || fetched

  async function handleSubmit(values) {
    setSubmitting(true)
    setError(null)

    const edits = {
      name: values.name.trim(),
      surname: values.surname.trim(),
      email: values.email.trim(),
      telephone: values.telephone.trim(),
      cityId: values.cityId === '' ? null : Number(values.cityId),
    }

    try {
      if (isEdit) {
        const saved = await updateCustomer(customerId, { ...record, ...edits })
        dispatch({ type: actionTypes.CUSTOMER_UPDATED, payload: saved })
      } else {
        const created = await createCustomer(edits)
        dispatch({ type: actionTypes.CUSTOMER_CREATED, payload: created })
      }

      navigate('/customers')
    } catch (requestError) {
      setError(describeError(requestError))
      setSubmitting(false)
    }
  }

  const title = isEdit ? 'Edit customer' : 'New customer'

  if (!token) {
    return (
      <>
        <PageBar title={title} />
        <main className="container py-4">
          <div className="panel p-4">
            <p className="page-subtitle mb-3">
              Managing customers is only available to signed-in users.
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
        <PageBar title={title} backTo="/customers" backLabel="All customers" />
        <main className="container py-4">
          <div className="panel">
            <TableSkeleton rows={3} columns={2} />
          </div>
          <span className="visually-hidden">Loading customer…</span>
        </main>
      </>
    )
  }

  return (
    <>
      <PageBar title={title} backTo="/customers" backLabel="All customers" />

      <main className="container py-4">
        <div className="panel p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <CustomerForm
            key={record ? record.id : 'new'}
            initialValues={record ? toFormValues(record) : EMPTY_CUSTOMER}
            cities={cities}
            submitting={submitting}
            submitLabel={isEdit ? 'Save changes' : 'Create customer'}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  )
}
