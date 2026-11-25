import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utils/format'
import { displayValue } from '../utils/customerTools'
import EmptyState from './EmptyState'

export default function ItemTable({ rows, billId }) {
  if (rows.length === 0) {
    return <EmptyState message="This bill has no items." />
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle data-table">
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Product number</th>
            <th scope="col" className="text-end">
              Quantity
            </th>
            <th scope="col" className="text-end">
              Total price
            </th>
            <th scope="col" className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td className="fw-medium">{displayValue(item.productName)}</td>
              <td className="text-nowrap">
                {displayValue(item.productNumber)}
              </td>
              <td className="text-end">{item.quantity}</td>
              <td className="text-end text-nowrap">
                {formatMoney(item.totalPrice)}
              </td>
              <td>
                <div className="row-actions">
                  <Link
                    className="btn btn-sm btn-outline-secondary"
                    to={`/bills/${billId}/items/${item.id}/edit`}
                  >
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

ItemTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      productName: PropTypes.string,
      productNumber: PropTypes.string,
      quantity: PropTypes.number,
      totalPrice: PropTypes.number,
    }),
  ).isRequired,
  billId: PropTypes.string.isRequired,
}
