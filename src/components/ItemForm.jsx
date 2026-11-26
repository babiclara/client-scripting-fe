import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { hasErrors, validateItem } from '../utils/validation'
import { describeProduct, filterProducts } from '../utils/itemTools'

const PRODUCT_LIMIT = 50

export default function ItemForm({
  initialValues,
  products,
  submitting,
  submitLabel,
  cancelTo,
  onSubmit,
}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [productQuery, setProductQuery] = useState('')

  const visibleProducts = useMemo(() => {
    let visible = filterProducts(products, productQuery, PRODUCT_LIMIT)
    const chosen = products.find(
      (product) => String(product.id) === values.productId,
    )

    if (chosen && !visible.some((product) => product.id === chosen.id)) {
      visible = [chosen].concat(visible)
    }

    return visible
  }, [productQuery, products, values.productId])

  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const found = validateItem(values)
    setErrors(found)

    if (!hasErrors(found)) {
      onSubmit(values)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="productId">
            Product
          </label>
          <input
            type="search"
            className="form-control mb-2"
            placeholder="Filter by name or product number"
            aria-label="Filter products"
            value={productQuery}
            onChange={(event) => setProductQuery(event.target.value)}
          />
          <select
            id="productId"
            className={`form-select ${errors.productId ? 'is-invalid' : ''}`}
            value={values.productId}
            onChange={(event) => setField('productId', event.target.value)}
          >
            <option value="">Choose a product</option>
            {visibleProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {describeProduct(product)}
              </option>
            ))}
          </select>
          {errors.productId && (
            <div className="invalid-feedback">{errors.productId}</div>
          )}
          <div className="field-hint">
            Showing {visibleProducts.length} of {products.length} products
          </div>
        </div>

        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            step="1"
            min="1"
            className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
            value={values.quantity}
            onChange={(event) => setField('quantity', event.target.value)}
          />
          {errors.quantity && (
            <div className="invalid-feedback">{errors.quantity}</div>
          )}
        </div>

        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="totalPrice">
            Total price
          </label>
          <input
            id="totalPrice"
            type="number"
            step="0.01"
            min="0"
            className={`form-control ${errors.totalPrice ? 'is-invalid' : ''}`}
            value={values.totalPrice}
            onChange={(event) => setField('totalPrice', event.target.value)}
          />
          {errors.totalPrice && (
            <div className="invalid-feedback">{errors.totalPrice}</div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <Link className="btn btn-outline-secondary" to={cancelTo}>
          Cancel
        </Link>
      </div>
    </form>
  )
}

ItemForm.propTypes = {
  initialValues: PropTypes.shape({
    productId: PropTypes.string,
    quantity: PropTypes.string,
    totalPrice: PropTypes.string,
  }).isRequired,
  products: PropTypes.array.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitLabel: PropTypes.string.isRequired,
  cancelTo: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
