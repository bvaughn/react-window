import React from 'react';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import styles from './CodeBlock.css';

const CodeBlock = ({ value }) => (
  <div className={styles.CodeBlock}>
    <div
      className="CodeMirror CodeMirror-wrap cm-s-material"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  </div>
);

export default CodeBlock;
