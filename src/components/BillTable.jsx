import PropTypes from 'prop-types'
import { formatDate, formatMoney } from '../utils/format'
import { displayValue } from '../utils/customerTools'
import EmptyState from './EmptyState'

export default function BillTable({ rows }) {
  if (rows.length === 0) {
    return <EmptyState message="This customer has no bills." />
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle data-table">
        <thead>
          <tr>
            <th scope="col">Bill number</th>
            <th scope="col">Date</th>
            <th scope="col">Comment</th>
            <th scope="col" className="text-end">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((bill) => (
            <tr key={bill.id}>
              <td className="fw-medium text-nowrap">
                {displayValue(bill.billNumber)}
              </td>
              <td className="text-nowrap">{formatDate(bill.date)}</td>
              <td className="comment-cell">{displayValue(bill.comment)}</td>
              <td className="text-end text-nowrap">{formatMoney(bill.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

BillTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      billNumber: PropTypes.string,
      date: PropTypes.string,
      comment: PropTypes.string,
      total: PropTypes.number,
    }),
  ).isRequired,
}
