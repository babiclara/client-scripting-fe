import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { createItem } from '../api/items'
import { fetchProducts } from '../api/products'
import ItemForm from '../components/ItemForm'
import PageBar from '../components/PageBar'

const EMPTY_ITEM = {
  productId: '',
  quantity: '1',
  totalPrice: '',
}

export default function ItemFormPage() {
  const { billId } = useParams()
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { products, token } = state

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const requestedProducts = useRef(false)
  const itemsPath = `/bills/${billId}/items`

  useEffect(() => {
    if (!token || products.length > 0 || requestedProducts.current) return
    requestedProducts.current = true

    fetchProducts()
      .then((data) =>
        dispatch({ type: actionTypes.PRODUCTS_LOADED, payload: data }),
      )
      .catch((requestError) => setError(requestError.message))
  }, [dispatch, products.length, token])

  async function handleSubmit(values) {
    setSubmitting(true)
    setError(null)

    const payload = {
      billId: Number(billId),
      productId: Number(values.productId),
      quantity: Number(values.quantity),
      totalPrice: Number(values.totalPrice),
    }

    try {
      const created = await createItem(payload)
      dispatch({ type: actionTypes.ITEM_CREATED, payload: created })
      navigate(itemsPath)
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <>
        <PageBar title="New item" />
        <main className="container py-4">
          <div className="panel p-4">
            <p className="page-subtitle mb-3">
              Managing bill items is only available to signed-in users.
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
      <PageBar title="New item" backTo={itemsPath} backLabel="Back to items" />

      <main className="container py-4">
        <div className="panel p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <ItemForm
            initialValues={EMPTY_ITEM}
            products={products}
            submitting={submitting}
            submitLabel="Create item"
            cancelTo={itemsPath}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  )
}
