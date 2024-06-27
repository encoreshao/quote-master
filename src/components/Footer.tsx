/* eslint-disable jsx-a11y/anchor-is-valid */
function HeroFooter(props: { setTab: (arg0: string) => void; tab: string }) {

  return (
    <div className="hero-foot">
      <nav className="tabs is-boxed is-fullwidth">
        <div className="container">
          <ul className="has-text-primary-100">
            <li
              onClick={() => props.setTab('overview')}
              className={props.tab === 'overview' ? 'is-active' : ''}
            >
              <a className="white"> Dashboard </a>
            </li>
            <li onClick={() => props.setTab('quotes')} className={props.tab === 'quotes' ? 'is-active' : ''}>
              <a> Quotes </a>
            </li>
            <li onClick={() => props.setTab('gitlab')} className={props.tab === 'gitlab' ? 'is-active' : ''}>
              <a> Gitlab </a>
            </li>
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
