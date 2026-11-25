import PropTypes from 'prop-types'

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <nav className="d-flex align-items-center gap-2" aria-label="Customer pages">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        &laquo; Previous
      </button>

      <span className="small text-secondary">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next &raquo;
      </button>
    </nav>
  )
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}
