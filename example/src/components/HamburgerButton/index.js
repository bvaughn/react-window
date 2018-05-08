import React from 'react';

import './HamburgerButton.css';

export const HamburgerButton = ({ clickHandler, type = 'button' }) => (
  <button onClick={clickHandler} type={type} className="hamburger">
    <div className="bar" />
    <div className="bar" />
    <div className="bar" />
  </button>
);
