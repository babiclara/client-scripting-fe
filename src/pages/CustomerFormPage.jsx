import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { createCustomer } from '../api/customers'
import { fetchCities } from '../api/cities'
import CustomerForm from '../components/CustomerForm'
import PageBar from '../components/PageBar'

const EMPTY_CUSTOMER = {
  name: '',
  surname: '',
  email: '',
  telephone: '',
  cityId: '',
}

export default function CustomerFormPage() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { cities, token } = state

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const requestedCities = useRef(false)

  useEffect(() => {
    if (cities.length > 0 || requestedCities.current) return
    requestedCities.current = true

    fetchCities()
      .then((data) =>
        dispatch({ type: actionTypes.CITIES_LOADED, payload: data }),
      )
      .catch((requestError) => setError(requestError.message))
  }, [cities.length, dispatch])

  async function handleSubmit(values) {
    setSubmitting(true)
    setError(null)

    const payload = {
      name: values.name.trim(),
      surname: values.surname.trim(),
      email: values.email.trim(),
      telephone: values.telephone.trim(),
      cityId: values.cityId === '' ? null : Number(values.cityId),
    }

    try {
      const created = await createCustomer(payload)
      dispatch({ type: actionTypes.CUSTOMER_CREATED, payload: created })
      navigate('/customers')
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <>
        <PageBar title="New customer" />
        <main className="container py-4">
          <div className="panel p-4">
            <p className="page-subtitle mb-3">
              Creating customers is only available to signed-in users.
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
      <PageBar
        title="New customer"
        backTo="/customers"
        backLabel="All customers"
      />

      <main className="container py-4">
        <div className="panel p-4 p-sm-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <CustomerForm
            initialValues={EMPTY_CUSTOMER}
            cities={cities}
            submitting={submitting}
            submitLabel="Create customer"
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  )
}
