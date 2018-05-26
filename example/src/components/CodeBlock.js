import React from 'react';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './CodeBlock.css';

const CodeBlock = ({ value }) => (
  <div className="CodeBlock">
    <div
      className="CodeMirror CodeMirror-wrap cm-s-material"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  </div>
);

export default CodeBlock;
