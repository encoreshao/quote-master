import { useFormContext } from "../contexts/FormContext";

/* eslint-disable jsx-a11y/anchor-is-valid */
function HeroFooter(props: { setTab: (arg0: string) => void; tab: string }) {
  const { formData } = useFormContext();

  return (
    <div className="hero-foot">
      <nav className="tabs is-boxed is-fullwidth has-background-primary-100">
        <div className="container">
          <ul>
            <li
              onClick={() => props.setTab('overview')}
              className={props.tab === 'overview' ? 'is-active' : ''}
            >
              <a className="white"> Overview </a>
            </li>
            {formData.enabledDashboard && <li onClick={() => props.setTab('dashboard')} className={props.tab === 'dashboard' ? 'is-active' : ''}>
              <a> Dashboard </a>
            </li>}
            {formData.enabledQuotes && <li onClick={() => props.setTab('quotes')} className={props.tab === 'quotes' ? 'is-active' : ''}>
              <a> Quotes </a>
            </li>}
            {formData.enabledGitlub && <li onClick={() => props.setTab('gitlab')} className={props.tab === 'gitlab' ? 'is-active' : ''}>
              <a> Gitlab </a>
            </li>}
            <li onClick={() => props.setTab('settings')} className={props.tab === 'settings' ? 'is-active' : ''}>
              <a> Settings </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default HeroFooter;
