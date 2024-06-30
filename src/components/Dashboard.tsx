/* eslint-disable jsx-a11y/anchor-is-valid */

import DateTime from './DateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
library.add(faCoffee)

function Dashboard() {
  return (
    <div className="hero-body" id="overview">
      <div className="container has-text-centered">
        <div className='cup-wrapper'>
          <div className='cup-box shake' style={{ position: 'relative', width: 'fit-content', margin: 'auto', }}>
            <span style={{
              position: 'absolute',
              fontSize: '60px',
              left: '28%',
              top: '27%',
              zIndex: 1,
              color: "var(--bulma-hero-h)"
            }}>
              Coffee
            </span>

            <FontAwesomeIcon icon="coffee" color='white' fontSize='400'/>

            {/* <span style={{
              position: 'absolute',
              fontSize: '20px',
              left: '32%',
              top: '84%',
              zIndex: 1,
              color: "var(--bulma-hero-h)"
            }}>Give me a coffee</span> */}
          </div>
        </div>
        <hr />
        <br />
        <div className="subtitle">
          <DateTime wday={true}/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
