import PropTypes from 'prop-types'

export default function SortableHeader({ label, column, sortBy, sortDir, onSort }) {
  const isActive = sortBy === column

  const buttonClass = `sort-button ${isActive ? 'sort-button-active' : ''}`
  const ariaSort = isActive ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'

  let arrow = '↕'
  if (isActive) {
    arrow = sortDir === 'asc' ? '▲' : '▼'
  }

  return (
    <th scope="col" aria-sort={ariaSort}>
      <button type="button" className={buttonClass} onClick={() => onSort(column)}>
        {label}
        <span className="sort-arrow">{arrow}</span>
      </button>
    </th>
  )
}

SortableHeader.propTypes = {
  label: PropTypes.string.isRequired,
  column: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDir: PropTypes.oneOf(['asc', 'desc']).isRequired,
  onSort: PropTypes.func.isRequired,
}
