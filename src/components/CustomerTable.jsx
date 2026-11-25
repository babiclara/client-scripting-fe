import PropTypes from 'prop-types'
import { displayValue } from '../utils/customerTools'

export default function CustomerTable({ rows }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle mb-0 customer-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Surname</th>
            <th scope="col">Email</th>
            <th scope="col">Telephone</th>
            <th scope="col">City</th>
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
}
