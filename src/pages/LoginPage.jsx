import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { login } from '../api/auth'

export default function LoginPage() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const token = await login(email, password)
      dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: { token, email } })
      navigate('/customers')
    } catch (error) {
      const message = error.response?.data?.message || error.message
      dispatch({ type: actionTypes.LOGIN_FAILURE, payload: message })
      setSubmitting(false)
    }
  }

  return (
    <section className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-6 col-lg-5">
        <h1 className="h3 mb-3">Sign in</h1>

        {state.authError && (
          <div className="alert alert-danger py-2">{state.authError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  )
}
