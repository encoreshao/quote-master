/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';

import HeroFooter from './components/Footer';
import HeroHeader from './components/Header';

import Overview from './components/Overview';
import Quotes from './components/Quotes';
import Gitlab from './components/Gitlab';
import Settings from './components/Settings';


function App() {
  const [tab, setTab] = useState('overview');

  return (
    <section className="hero is-info is-fullheight">
      <HeroHeader />

      {tab === 'overview' && <Overview />}
      {tab === 'quotes' && <Quotes />}
      {tab === 'gitlab' && <Gitlab />}
      {tab === 'settings' && <Settings />}

      <HeroFooter setTab={setTab} tab={tab} />
    </section>
  );
}

export default App;
