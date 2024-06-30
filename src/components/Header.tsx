/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { faHome, faEnvelopeCircleCheck, faHeartPulse } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faGitlab, faBandcamp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormContext } from '../contexts/FormContext';

function HeroFooter() {
  const { formData } = useFormContext();

  return (
    <div className="hero-head">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <a className="navbar-item has-text-white">
              <span>
                <FontAwesomeIcon fontSize='200' color='white' icon={faHeartPulse} />
              </span>
            </a>
            <span className="navbar-burger" data-target="navbarMenuHeroB">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>

          <div id="navbarMenuHeroB" className="navbar-menu">
            <div className="navbar-end has-background-primary-10">
              <a className="navbar-item is-active">
                <span className="icon">
                  <FontAwesomeIcon icon={faHome} />
                </span>
                <span> Home </span>
              </a>

              <a className="navbar-item" href="https://mail.google.com/mail/u/0/#inbox">
                <span className="icon">
                  <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
                </span>
                <span> Gmail </span>
              </a>

              {formData.gitlab && <a className="navbar-item" href={formData.gitlab} target="_blank">
                <span className="icon">
                  <FontAwesomeIcon icon={faGitlab} />
                </span>
                <span> GitLab </span>
              </a>}

              {formData.bamboohr && <a className="navbar-item" href={formData.bamboohr} target="_blank">
                <span className="icon">
                  <FontAwesomeIcon icon={faBandcamp} />
                </span>
                <span> BambooHR </span>
              </a>}

              {formData.github && <a className="navbar-item" href={formData.github} target="_blank">
                <span className="icon">
                  <FontAwesomeIcon icon={faGithub} />
                </span>

                <span> Github </span>
              </a>}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeroFooter;
