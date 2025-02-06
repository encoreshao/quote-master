/* eslint-disable jsx-a11y/anchor-is-valid */

import DateTime from './DateTime';

function Overview() {
  return (
    <>
      <div className="hero-body" style={{ alignItems: 'baseline', marginTop: '5%' }}>
        <div className="container has-text-centered">
          <div className="has-text-centered" style={{ marginTop: '10%' }}>
            <DateTime withYear={false} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Overview;
