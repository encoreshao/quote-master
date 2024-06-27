/* eslint-disable jsx-a11y/anchor-is-valid */

import DateTime from './DateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
library.add(faCoffee)

function Overview() {
  return (
    <div className="hero-body" id="overview">
      <div className="container has-text-centered">
        <p>
          <FontAwesomeIcon icon="coffee" color='white' fontSize='400' className="shake"/>
        </p>
        <p className="subtitle">
          <DateTime />
        </p>
        <hr />
        <p className="title">Encore Shao</p>
      </div>
    </div>
  );
}

export default Overview;
