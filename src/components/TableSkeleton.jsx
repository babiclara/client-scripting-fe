import PropTypes from 'prop-types'

export default function TableSkeleton({ rows, columns }) {
  const rowKeys = Array.from({ length: rows }, (_, index) => index)
  const cellKeys = Array.from({ length: columns }, (_, index) => index)

  return (
    <div aria-hidden="true">
      {rowKeys.map((rowKey) => (
        <div className="skeleton-row" key={rowKey}>
          {cellKeys.map((cellKey) => (
            <span className="skeleton-cell" key={cellKey} />
          ))}
        </div>
      ))}
    </div>
  )
}

TableSkeleton.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
}
