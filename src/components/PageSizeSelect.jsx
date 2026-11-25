import PropTypes from 'prop-types'

const PAGE_SIZES = [10, 20, 50]

export default function PageSizeSelect({ value, onChange }) {
  return (
    <div className="input-group">
      <label className="input-group-text" htmlFor="page-size">
        Show
      </label>
      <select
        id="page-size"
        className="form-select"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="input-group-text">per page</span>
    </div>
  )
}

PageSizeSelect.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}
