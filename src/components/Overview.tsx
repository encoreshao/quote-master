/* eslint-disable jsx-a11y/anchor-is-valid */

import { useFormContext } from '../contexts/FormContext';
import DateTime from './DateTime';

function Overview() {
  const { formData } = useFormContext();

  return (
    <>
      <div className="hero-body" id="overview">
        <div className="container has-text-centered">
          <DateTime wday={true} />
          <hr />
        </div>
      </div>

      {formData.overview &&
        <div className="card has-background-primary-100">
          <div className="container card-content">
            <p className="title">
              Hello! {formData.username}
            </p>
            <br />
            <p className="subtitle">
              {formData.overview}
            </p>
          </div>
        </div>
      }
    </>
  );
}

export default Overview;
