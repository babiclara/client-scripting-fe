import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { deleteItem, fetchItemsByBill } from '../api/items'
import { fetchBill } from '../api/bills'
import { fetchProducts } from '../api/products'
import { formatMoney, sumAmounts } from '../utils/format'
import {
  attachProductDetails,
  buildProductLookup,
  countUnits,
} from '../utils/itemTools'
import ItemTable from '../components/ItemTable'
import TableSkeleton from '../components/TableSkeleton'
import PageBar from '../components/PageBar'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ItemsPage() {
  const { billId } = useParams()
  const { state, dispatch } = useApp()
  const { items, itemsBill, products, itemsStatus, itemsError, token } = state

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const loadedFor = useRef(null)

  useEffect(() => {
    if (!token) return
    if (loadedFor.current === billId) return
    loadedFor.current = billId

    async function load() {
      dispatch({ type: actionTypes.ITEMS_LOAD_START })

      try {
        const [itemData, bill, productData] = await Promise.all([
          fetchItemsByBill(billId),
          fetchBill(billId),
          products.length === 0 ? fetchProducts() : products,
        ])

        dispatch({
          type: actionTypes.ITEMS_LOAD_SUCCESS,
          payload: { items: itemData, bill, products: productData },
        })
      } catch (requestError) {
        dispatch({
          type: actionTypes.ITEMS_LOAD_FAILURE,
          payload: requestError.message,
        })
      }
    }

    load()
  }, [billId, dispatch, products, token])

  const rows = useMemo(
    () => attachProductDetails(items, buildProductLookup(products)),
    [items, products],
  )

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)

    try {
      await deleteItem(pendingDelete.id)
      dispatch({ type: actionTypes.ITEM_DELETED, payload: pendingDelete.id })
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
        <PageBar title="Bill items" />
        <main className="container py-4">
          <div className="panel p-4">
            <p className="page-subtitle mb-3">
              Bill items are only available to signed-in users.
            </p>
            <Link className="btn btn-primary" to="/login">
              Sign in
            </Link>
          </div>
        </main>
      </>
    )
  }

  if (itemsStatus === 'loading' || itemsStatus === 'idle') {
    return (
      <>
        <PageBar title="Bill items" />
        <main className="container py-4">
          <div className="panel">
            <TableSkeleton rows={5} columns={4} />
          </div>
          <span className="visually-hidden">Loading bill items…</span>
        </main>
      </>
    )
  }

  if (itemsStatus === 'error') {
    return (
      <>
        <PageBar title="Bill items" />
        <main className="container py-4">
          <div className="alert alert-danger">
            <strong>Could not load bill items.</strong> {itemsError}
          </div>
        </main>
      </>
    )
  }

  const title = itemsBill ? `Bill ${itemsBill.billNumber}` : 'Bill items'
  const backTo = itemsBill
    ? `/customers/${itemsBill.customerId}/bills`
    : '/customers'

  return (
    <>
      <PageBar
        title={title}
        pills={[
          `${rows.length} items`,
          `${countUnits(items)} units`,
          formatMoney(sumAmounts(items, 'totalPrice')),
        ]}
        backTo={backTo}
        backLabel="Back to bills"
        action={
          <Link className="btn btn-primary" to={`/bills/${billId}/items/new`}>
            New item
          </Link>
        }
      />

      <main className="container py-4">
        <div className="panel">
          <ItemTable
            rows={rows}
            billId={billId}
            onDelete={setPendingDelete}
          />
        </div>
      </main>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete item"
          message={`Remove ${pendingDelete.productName || 'this item'} from the bill? This cannot be undone.`}
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
