/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';

import HeroFooter from './components/Footer';
import HeroHeader from './components/Header';

import Overview from './components/Overview';
import Quotes from './components/Quotes';
import Gitlab from './components/Gitlab';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import Bookmarks from './components/bookmarks/Index';
import { getStorage } from './utils';


function App() {
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    getStorage({ currentTab: 'overview' }, result => {
      setTab(result.currentTab);
    });
  }, []);

  return (
    <section className="hero is-info is-fullheight">
      <HeroHeader />

      {tab === 'overview' && <Overview />}
      {tab === 'dashboard' && <Dashboard />}
      {tab === 'quotes' && <Quotes />}
      {tab === 'gitlab' && <Gitlab />}
      {tab === 'bookmarks' && <Bookmarks />}
      {tab === 'settings' && <Settings />}

      <HeroFooter setTab={setTab} tab={tab} />
    </section>
  );
}

export default App;
