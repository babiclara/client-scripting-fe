import PropTypes from 'prop-types'

export default function SearchBox({ value, onChange }) {
  return (
    <div className="input-group">
      <span className="input-group-text" id="customer-search-label">
        Search
      </span>
      <input
        type="search"
        className="form-control"
        placeholder="Name, surname, email, telephone or city"
        aria-labelledby="customer-search-label"
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
