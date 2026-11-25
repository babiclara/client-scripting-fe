import { NavLink } from 'react-router-dom'

export default function NavBar() {
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active fw-semibold' : ''}`

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/customers">
          Bill Manager
        </NavLink>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className={linkClass} to="/customers">
              Customers
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
