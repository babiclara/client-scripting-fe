import PropTypes from 'prop-types'

const PAGE_SIZES = [10, 20, 50]

export default function PageSizeSelect({ value, onChange }) {
  return (
    <div className="segmented" role="group" aria-label="Rows per page">
      <span className="segmented-label">Rows</span>
      {PAGE_SIZES.map((size) => {
        const isActive = size === value
        const optionClass = `segmented-option ${
          isActive ? 'segmented-option-active' : ''
        }`

        return (
          <button
            key={size}
            type="button"
            className={optionClass}
            aria-pressed={isActive}
            onClick={() => onChange(size)}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}

PageSizeSelect.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}
