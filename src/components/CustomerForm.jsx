import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { hasErrors, validateCustomer } from '../utils/validation'

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'given-name' },
  { name: 'surname', label: 'Surname', type: 'text', autoComplete: 'family-name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'telephone', label: 'Telephone', type: 'tel', autoComplete: 'tel' },
]

export default function CustomerForm({
  initialValues,
  cities,
  submitting,
  submitLabel,
  onSubmit,
}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const found = validateCustomer(values)
    setErrors(found)

    if (!hasErrors(found)) {
      onSubmit(values)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        {FIELDS.map((field) => (
          <div className="col-12 col-sm-6" key={field.name}>
            <label className="form-label" htmlFor={field.name}>
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              onChange={(event) => setField(field.name, event.target.value)}
            />
            {errors[field.name] && (
              <div className="invalid-feedback">{errors[field.name]}</div>
            )}
          </div>
        ))}

        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor="cityId">
            City
          </label>
          <select
            id="cityId"
            className="form-select"
            value={values.cityId}
            onChange={(event) => setField('cityId', event.target.value)}
          >
            <option value="">No city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <Link className="btn btn-outline-secondary" to="/customers">
          Cancel
        </Link>
      </div>
    </form>
  )
}

CustomerForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    surname: PropTypes.string,
    email: PropTypes.string,
    telephone: PropTypes.string,
    cityId: PropTypes.string,
  }).isRequired,
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    }),
  ).isRequired,
  submitting: PropTypes.bool.isRequired,
  submitLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
