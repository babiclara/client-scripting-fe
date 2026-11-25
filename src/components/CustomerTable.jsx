import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import SortableHeader from './SortableHeader'
import { displayValue } from '../utils/customerTools'

const COLUMNS = [
  { column: 'name', label: 'Name' },
  { column: 'surname', label: 'Surname' },
  { column: 'email', label: 'Email' },
  { column: 'telephone', label: 'Telephone' },
  { column: 'city', label: 'City' },
]

export default function CustomerTable({ rows, sortBy, sortDir, onSort, canViewBills }) {
  if (rows.length === 0) {
    return (
      <p className="alert alert-light border mb-0">
        No customers match your search.
      </p>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle mb-0 customer-table">
        <thead>
          <tr>
            {COLUMNS.map(({ column, label }) => (
              <SortableHeader
                key={column}
                column={column}
                label={label}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
              />
            ))}
            {canViewBills && (
              <th scope="col" className="text-end">
                Bills
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((customer) => (
            <tr key={customer.id}>
              <td>{displayValue(customer.name)}</td>
              <td>{displayValue(customer.surname)}</td>
              <td>{displayValue(customer.email)}</td>
              <td className="text-nowrap">{displayValue(customer.telephone)}</td>
              <td className={customer.city === '' ? 'text-secondary' : ''}>
                {displayValue(customer.city)}
              </td>
              {canViewBills && (
                <td className="text-end">
                  <Link
                    className="btn btn-sm btn-outline-secondary"
                    to={`/customers/${customer.id}/bills`}
                  >
                    View
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

CustomerTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      surname: PropTypes.string,
      email: PropTypes.string,
      telephone: PropTypes.string,
      city: PropTypes.string,
    }),
  ).isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDir: PropTypes.oneOf(['asc', 'desc']).isRequired,
  onSort: PropTypes.func.isRequired,
  canViewBills: PropTypes.bool.isRequired,
}
