/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { faHome, faHeartPulse, faDownload, faGears, faMailBulk } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faGitlab, faBandcamp, faBots } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormContext } from '../contexts/FormContext';

interface NavItemProps {
  href?: string;
  icon: any;
  text: string;
  onClick?: (event: any) => void;
  isExternal: boolean;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, text, onClick, isExternal, isActive }) => (
  <a
    className={`navbar-item ${isActive ? 'is-active' : ''}`}
    href={isExternal ? href : undefined}
    target={isExternal ? "_blank" : undefined}
    onClick={onClick}
    onMouseOver={(event) => event.currentTarget.classList.toggle('has-background-link')}
    onMouseOut={(event) => event.currentTarget.classList.toggle('has-background-link')}
  >
    <span className="icon">
      <FontAwesomeIcon icon={icon} color='white' />
    </span>
    <span className='has-text-white'> {text} </span>
  </a>
);

function HeroFooter() {
  const { formData } = useFormContext();

  const openInternalLink = (eventName: string) => {
    if (chrome.runtime) { chrome.runtime.sendMessage({ action: eventName }) }
  }

  const navItems = [
    { condition: true, href: "#", icon: faHome, text: "Home", isExternal: false, isActive: true },
    { condition: formData.enabledGmail, href: "https://mail.google.com/mail/u/0/#inbox", icon: faMailBulk, text: "Gmail", isExternal: true },
    { condition: formData.gitlab, href: formData.gitlab, icon: faGitlab, text: "GitLab", isExternal: true },
    { condition: formData.bamboohr, href: formData.bamboohr, icon: faBandcamp, text: "BambooHR", isExternal: true },
    { condition: formData.github, href: formData.github, icon: faGithub, text: "Github", isExternal: true },
    { condition: formData.chatBot, href: formData.chatBot, icon: faBots, text: "Chatbot", isExternal: true },
    { condition: formData.enabledDownloads, href: "#", icon: faDownload, text: "Downloads", onClick: () => openInternalLink('downloads'), isExternal: false },
    { condition: formData.enabledExtensions, href: "#", icon: faGears, text: "Extensions", onClick: () => openInternalLink('extensions'), isExternal: false },
  ];

  return (
    <div className="hero-head">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <a
              className="navbar-item has-text-white"
              onMouseOver={(event) => event.currentTarget.classList.toggle('has-background-link') }
              onMouseOut={(event) => event.currentTarget.classList.toggle('has-background-link') }
            >
              <span>
                <FontAwesomeIcon fontSize='200' icon={faHeartPulse} />
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
              {navItems.filter(item => item.condition).map((item, index) => (
                <NavItem key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeroFooter;
