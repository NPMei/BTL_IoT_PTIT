// FanIcon.jsx
import React from 'react';
import PropTypes from 'prop-types';

const FanIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="48"
    height="48"
  >
    <circle cx="12" cy="12" r="3" fill="#333" />
    <path
      d="M12 2C13.5 2 14.9 3 15.4 4.4C16 5.9 15.6 7.5 14.7 8.7L14.1 9.5C13.6 10.2 13 10.7 12 10.7C11 10.7 10.4 10.2 9.9 9.5L9.3 8.7C8.4 7.5 8 5.9 8.6 4.4C9.1 3 10.5 2 12 2Z"
      fill="#666"
    />
    <path
      d="M12 22C10.5 22 9.1 21 8.6 19.6C8 18.1 8.4 16.5 9.3 15.3L9.9 14.5C10.4 13.8 11 13.3 12 13.3C13 13.3 13.6 13.8 14.1 14.5L14.7 15.3C15.6 16.5 16 18.1 15.4 19.6C14.9 21 13.5 22 12 22Z"
      fill="#666"
    />
    <path
      d="M22 12C22 13.5 21 14.9 19.6 15.4C18.1 16 16.5 15.6 15.3 14.7L14.5 14.1C13.8 13.6 13.3 13 13.3 12C13.3 11 13.8 10.4 14.5 9.9L15.3 9.3C16.5 8.4 18.1 8 19.6 8.6C21 9.1 22 10.5 22 12Z"
      fill="#666"
    />
    <path
      d="M2 12C2 10.5 3 9.1 4.4 8.6C5.9 8 7.5 8.4 8.7 9.3L9.5 9.9C10.2 10.4 10.7 11 10.7 12C10.7 13 10.2 13.6 9.5 14.1L8.7 14.7C7.5 15.6 5.9 16 4.4 15.4C3 14.9 2 13.5 2 12Z"
      fill="#666"
    />
  </svg>
);

FanIcon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FanIcon;
