import React from 'react';

import styles from './MobileNavButton.module.css';

export const MobileNavButton = ({ onClick, isActive }) => (
  <button
    type="button"
    className={isActive ? styles.MobileNavButtonActive : styles.MobileNavButton}
    onClick={onClick}
  >
    <svg className={styles.MobileNavButtonIcon} viewBox="0 0 24 24">
      <title>Hamburger Menu Icon</title>
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
        className={styles.MobileNavButtonIconPath}
      />
    </svg>
  </button>
);
