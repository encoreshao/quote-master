/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { faHeartPulse, faDownload, faGears, faMailBulk } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faGitlab, faBandcamp, faBots } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormContext } from '../contexts/FormContext';
import { useEffect, useState } from 'react';

interface NavItemProps {
  submenu?: boolean;
  href?: string;
  icon?: any;
  text: string;
  onClick?: (event: any) => void;
  isExternal: boolean;
  isActive?: boolean;
  items?: NavItemProps[];
}

const NavItem: React.FC<NavItemProps> = ({ submenu, href, icon, text, onClick, isExternal, isActive, items }) => (
  <>
    {submenu ? (
      <div className="navbar-item has-dropdown is-hoverable">
        <a
          className="navbar-link"
          onMouseOver={(event) => event.currentTarget.classList.toggle('has-background-link')}
          onMouseOut={(event) => event.currentTarget.classList.toggle('has-background-link')}
        >
          <span className="icon">
            <FontAwesomeIcon icon={icon} color='white' />
          </span>
          <span className='has-text-white'> {text} </span>
        </a>

        <div
          className="navbar-dropdown has-background-primary-10"
          style={{ width: '-webkit-fill-available' }}
        >
          {items?.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </div>
      </div>
    ) : (
      <a
        className={`navbar-item has-background-primary-10 ${isActive ? 'is-active' : ''}`}
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
    )}
  </>
);

function HeroHeader(props: { tab: string }) {
  const { formData } = useFormContext();
  const [pageTitle, setPageTitle] = useState('');

  const openInternalLink = (eventName: string) => {
    if (chrome.runtime) { chrome.runtime.sendMessage({ action: eventName }) }
  }

  useEffect(() => {
    if (props.tab) {
      const currentTab = props.tab.charAt(0).toUpperCase() + formData.currentTab.slice(1)

      setPageTitle(currentTab);
    }
  }, [props.tab])

  const navItems = [
    { submenu: false, condition: formData.enabledGmail, href: "https://mail.google.com/mail/u/0/#inbox", icon: faMailBulk, text: "Gmail", isExternal: true },
    { submenu: false, condition: formData.gitlab, href: formData.gitlab, icon: faGitlab, text: "GitLab", isExternal: true },
    { submenu: false, condition: formData.bamboohr, href: formData.bamboohr, icon: faBandcamp, text: "BambooHR", isExternal: true },
    { submenu: false, condition: formData.github, href: formData.github, icon: faGithub, text: "Github", isExternal: true },
    { submenu: false, condition: formData.enabledDownloads, href: "#", icon: faDownload, text: "Downloads", onClick: () => openInternalLink('downloads'), isExternal: false },
    { submenu: false, condition: formData.enabledExtensions, href: "#", icon: faGears, text: "Extensions", onClick: () => openInternalLink('extensions'), isExternal: false },
    {
      submenu: true,
      icon: faBots,
      text: "ChatBots",
      isExternal: true,
      items: [
        {
          condition: formData.openAIChatBotURL,
          href: formData.openAIChatBotURL,
          text: "OpenAI",
          isExternal: true,
          submenu: false
        },
        {
          condition: formData.deepSeekChatBotURL,
          href: formData.deepSeekChatBotURL,
          text: "DeepSeek",
          isExternal: true,
          submenu: false
        },
        {
          condition: formData.geminiChatBotURL,
          href: formData.geminiChatBotURL,
          text: "Gemini",
          isExternal: true,
          submenu: false
        },
      ]
    },
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
              <span style={{ marginTop: '-15px' }}>
                <FontAwesomeIcon fontSize='200' icon={faHeartPulse} />
              </span>
              <p className='title has-text-white ml-4'>{pageTitle}</p>
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
              {navItems.filter(item => item.condition || item.submenu).map((item, index) => (
                <NavItem key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeroHeader;
