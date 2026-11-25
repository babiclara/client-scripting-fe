import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function PageBar({
  title,
  pills = [],
  backTo = null,
  backLabel = 'Back',
  action = null,
}) {
  return (
    <div className="page-bar">
      <div className="container page-bar-inner">
        <div>
          {backTo && (
            <Link className="back-link" to={backTo}>
              &larr; {backLabel}
            </Link>
          )}

          <div className="page-bar-title">
            <h1 className="page-title">{title}</h1>
            {pills.map((pill) => (
              <span className="pill" key={pill}>
                {pill}
              </span>
            ))}
          </div>
        </div>

        {action}
      </div>
    </div>
  )
}

PageBar.propTypes = {
  title: PropTypes.string.isRequired,
  pills: PropTypes.arrayOf(PropTypes.string),
  backTo: PropTypes.string,
  backLabel: PropTypes.string,
  action: PropTypes.node,
}
