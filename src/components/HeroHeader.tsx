/* eslint-disable jsx-a11y/anchor-is-valid */
import { faDroplet, faHome, faCode, faMailBulk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function HeroFooter() {
  return (
    <div className="hero-head">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <a className="navbar-item has-text-primary-100">
              <span color='white'> Quote Master </span>
            </a>
            <span className="navbar-burger" data-target="navbarMenuHeroB">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>

          <div id="navbarMenuHeroB" className="navbar-menu">
            <div className="navbar-end has-background-primary-100">
              <a className="navbar-item is-active">
                <span className="icon">
                  <FontAwesomeIcon icon={faHome} />
                </span>
                <span> Home </span>
              </a>

              <a className="navbar-item" href="https://mail.google.com/mail/u/0/#inbox">
                <span className="icon">
                  <FontAwesomeIcon icon={faMailBulk} />
                </span>
                <span> Gmail </span>
              </a>

              <a className="navbar-item" href="https://ekohe.bamboohr.com/home/">
                <span className="icon">
                  <FontAwesomeIcon icon={faDroplet} />
                </span>
                <span> BambooHR </span>
              </a>

              <a className="navbar-item" href="https://github.com/encoreshao">
                <span className="icon">
                  <FontAwesomeIcon icon={faCode} />
                </span>

                <span> Github </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeroFooter;
