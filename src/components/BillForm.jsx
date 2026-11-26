import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { hasErrors, validateBill } from '../utils/validation'
import {
  describeCard,
  describeSeller,
  filterCards,
} from '../utils/billTools'

const CARD_LIMIT = 50

export default function BillForm({
  initialValues,
  sellers,
  creditCards,
  submitting,
  submitLabel,
  cancelTo,
  onSubmit,
}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [cardQuery, setCardQuery] = useState('')

  const visibleCards = useMemo(() => {
    let visible = filterCards(creditCards, cardQuery, CARD_LIMIT)
    const chosen = creditCards.find(
      (card) => String(card.id) === values.creditCardId,
    )

    if (chosen && !visible.some((card) => card.id === chosen.id)) {
      visible = [chosen].concat(visible)
    }

    return visible
  }, [cardQuery, creditCards, values.creditCardId])

  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const found = validateBill(values)
    setErrors(found)

    if (!hasErrors(found)) {
      onSubmit(values)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="billNumber">
            Bill number
          </label>
          <input
            id="billNumber"
            type="text"
            className={`form-control ${errors.billNumber ? 'is-invalid' : ''}`}
            value={values.billNumber}
            onChange={(event) => setField('billNumber', event.target.value)}
          />
          {errors.billNumber && (
            <div className="invalid-feedback">{errors.billNumber}</div>
          )}
        </div>

        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
            value={values.date}
            onChange={(event) => setField('date', event.target.value)}
          />
          {errors.date && <div className="invalid-feedback">{errors.date}</div>}
        </div>

        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="total">
            Total
          </label>
          <input
            id="total"
            type="number"
            step="0.01"
            min="0"
            className={`form-control ${errors.total ? 'is-invalid' : ''}`}
            value={values.total}
            onChange={(event) => setField('total', event.target.value)}
          />
          {errors.total && (
            <div className="invalid-feedback">{errors.total}</div>
          )}
        </div>

        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="sellerId">
            Seller
          </label>
          <select
            id="sellerId"
            className="form-select"
            value={values.sellerId}
            onChange={(event) => setField('sellerId', event.target.value)}
          >
            <option value="">No seller</option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {describeSeller(seller)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="creditCardId">
            Credit card
          </label>
          <input
            type="search"
            className="form-control mb-2"
            placeholder="Filter by type or last digits"
            aria-label="Filter credit cards"
            value={cardQuery}
            onChange={(event) => setCardQuery(event.target.value)}
          />
          <select
            id="creditCardId"
            className="form-select"
            value={values.creditCardId}
            onChange={(event) => setField('creditCardId', event.target.value)}
          >
            <option value="">No credit card</option>
            {visibleCards.map((card) => (
              <option key={card.id} value={card.id}>
                {describeCard(card)}
              </option>
            ))}
          </select>
          <div className="field-hint">
            Showing {visibleCards.length} of {creditCards.length} cards
          </div>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="comment">
            Comment
          </label>
          <textarea
            id="comment"
            className="form-control"
            rows="3"
            value={values.comment}
            onChange={(event) => setField('comment', event.target.value)}
          />
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

BillForm.propTypes = {
  initialValues: PropTypes.shape({
    billNumber: PropTypes.string,
    date: PropTypes.string,
    total: PropTypes.string,
    sellerId: PropTypes.string,
    creditCardId: PropTypes.string,
    comment: PropTypes.string,
  }).isRequired,
  sellers: PropTypes.array.isRequired,
  creditCards: PropTypes.array.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitLabel: PropTypes.string.isRequired,
  cancelTo: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
