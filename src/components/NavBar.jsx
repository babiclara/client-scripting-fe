import { NavLink } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { logout } from '../api/auth'

export default function NavBar() {
  const { state, dispatch } = useApp()

  const linkClass = ({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`

  function handleSignOut() {
    logout()
    dispatch({ type: actionTypes.LOGOUT })
  }

  return (
    <header className="top-bar">
      <div className="container top-bar-inner">
        <NavLink className="top-brand" to="/customers">
          <span className="brand-mark" aria-hidden="true">
            BM
          </span>
          <span className="d-none d-md-inline">Bill Manager</span>
        </NavLink>

        <nav className="top-nav" aria-label="Main">
          <NavLink className={linkClass} to="/customers">
            Customers
          </NavLink>
        </nav>

        {state.token ? (
          <div className="top-actions">
            <span className="top-user d-none d-lg-inline">
              {state.userEmail}
            </span>
            <button type="button" className="top-cta" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="top-actions">
            <NavLink className="top-cta" to="/login">
              Sign in
            </NavLink>
          </div>
        )}
      </div>
    </header>
  )
}
