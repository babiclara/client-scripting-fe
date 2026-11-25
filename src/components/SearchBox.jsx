import PropTypes from 'prop-types'

export default function SearchBox({ value, onChange }) {
  return (
    <div className="search-field">
      <svg
        className="search-icon"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className="form-control"
        placeholder="Search name, surname, email, telephone or city"
        aria-label="Search customers"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

SearchBox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
