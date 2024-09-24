import React from 'react';
import PropTypes from 'prop-types';
import './AirConditionerIcon.css'; 

const AcIcon = ({ className, isOn }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path d="M4 9h16v6H4zm0-2c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2H4zm-1-3h18c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    {isOn && (
      <>
        <path className="ac-blow ac-blow-1" d="M6 12c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/>
        <path className="ac-blow ac-blow-2" d="M12 12c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/>
        <path className="ac-blow ac-blow-3" d="M18 12c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/>
      </>
    )}
  </svg>
);

AcIcon.propTypes = {
  className: PropTypes.string,
  isOn: PropTypes.bool.isRequired,
};

export default AcIcon;
