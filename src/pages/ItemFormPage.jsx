import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { createItem, fetchItem, updateItem } from '../api/items'
import { fetchProducts } from '../api/products'
import ItemForm from '../components/ItemForm'
import TableSkeleton from '../components/TableSkeleton'
import PageBar from '../components/PageBar'

const EMPTY_ITEM = {
  productId: '',
  quantity: '1',
  totalPrice: '',
}

function toFormValues(item) {
  return {
    productId: String(item.productId),
    quantity: String(item.quantity),
    totalPrice: String(item.totalPrice),
  }
}

export default function ItemFormPage() {
  const { billId, itemId } = useParams()
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { items, products, token } = state

  const isEdit = Boolean(itemId)
  const fromStore = items.find((entry) => String(entry.id) === itemId)

  const [fetched, setFetched] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const requestedProducts = useRef(false)
  const requestedItem = useRef(false)
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

  useEffect(() => {
    if (!token || !isEdit || fromStore || requestedItem.current) return
    requestedItem.current = true

    fetchItem(itemId)
      .then((data) => setFetched(data))
      .catch((requestError) => setError(requestError.message))
  }, [fromStore, isEdit, itemId, token])

  const record = fromStore || fetched

  async function handleSubmit(values) {
    setSubmitting(true)
    setError(null)

    const edits = {
      billId: Number(billId),
      productId: Number(values.productId),
      quantity: Number(values.quantity),
      totalPrice: Number(values.totalPrice),
    }

    try {
      if (isEdit) {
        const saved = await updateItem(itemId, { ...record, ...edits })
        dispatch({ type: actionTypes.ITEM_UPDATED, payload: saved })
      } else {
        const created = await createItem(edits)
        dispatch({ type: actionTypes.ITEM_CREATED, payload: created })
      }

      navigate(itemsPath)
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message)
      setSubmitting(false)
    }
  }

  const title = isEdit ? 'Edit item' : 'New item'

  if (!token) {
    return (
      <>
        <PageBar title={title} />
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

  if (isEdit && !record) {
    return (
      <>
        <PageBar title={title} backTo={itemsPath} backLabel="Back to items" />
        <main className="container py-4">
          <div className="panel">
            <TableSkeleton rows={3} columns={2} />
          </div>
          <span className="visually-hidden">Loading item…</span>
        </main>
      </>
    )
  }

  return (
    <>
      <PageBar title={title} backTo={itemsPath} backLabel="Back to items" />

      <main className="container py-4">
        <div className="panel p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <ItemForm
            key={record ? record.id : 'new'}
            initialValues={record ? toFormValues(record) : EMPTY_ITEM}
            products={products}
            submitting={submitting}
            submitLabel={isEdit ? 'Save changes' : 'Create item'}
            cancelTo={itemsPath}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  )
}
