/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { faHome, faHeartPulse, faDownload, faGears, faMailBulk } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faGitlab, faBandcamp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormContext } from '../contexts/FormContext';

function HeroFooter() {
  const { formData } = useFormContext();

  const openInternalLink = (eventName: string) => {
    chrome.runtime.sendMessage({ action: eventName })
  }

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

              {formData.enabledGmail && <a className="navbar-item" href="https://mail.google.com/mail/u/0/#inbox" target="_blank">
                <span className="icon">
                  <FontAwesomeIcon icon={faMailBulk} />
                </span>
                <span> Gmail </span>
              </a>}

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
              {formData.enabledDownloads && <a className="navbar-item" href="downdloads" onClick={() => openInternalLink('downloads')}>
                <span className="icon">
                  <FontAwesomeIcon icon={faDownload} />
                </span>

                <span> Downloads </span>
              </a>}

              {formData.enabledExtensions && <a className="navbar-item" href="extensions" onClick={() => openInternalLink('extensions')}>
                <span className="icon">
                  <FontAwesomeIcon icon={faGears} />
                </span>

                <span> Extensions </span>
              </a>}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeroFooter;
