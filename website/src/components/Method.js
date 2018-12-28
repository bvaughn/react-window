import React from 'react';

import styles from './Method.module.css';

export default ({ children, name }) => (
  <div className={styles.MethodApi}>
    <h1 className={styles.MethodApiHeader}>{name}</h1>
    <div className={styles.MethodApiSummary}>{children}</div>
  </div>
);
