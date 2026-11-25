import { NavLink } from 'react-router-dom'
import { useApp } from '../state/useApp'
import { actionTypes } from '../state/appReducer'
import { logout } from '../api/auth'

export default function NavBar() {
  const { state, dispatch } = useApp()

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active fw-semibold' : ''}`

  function handleSignOut() {
    logout()
    dispatch({ type: actionTypes.LOGOUT })
  }

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/customers">
          Bill Manager
        </NavLink>

        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink className={linkClass} to="/customers">
              Customers
            </NavLink>
          </li>
        </ul>

        {state.token ? (
          <div className="d-flex align-items-center gap-2">
            <span className="navbar-text small d-none d-sm-inline">
              {state.userEmail}
            </span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        ) : (
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className={linkClass} to="/login">
                Sign in
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}
