import PropTypes from 'prop-types'

export default function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <svg
        className="empty-state-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 7.5 6 4h12l2 3.5" />
        <path d="M4 7.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.5z" />
        <path d="M4 13h4l1.5 2.5h5L16 13h4" />
      </svg>
      <p className="empty-state-text">{message}</p>
    </div>
  )
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
}
