import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './CodeBlock.css';

const CodeBlock = ({ value }) => (
  <div className="CodeBlock">
    <CodeMirror options={OPTIONS} value={value.trim()} />
  </div>
);

const OPTIONS = {
  height: 'auto',
  lineWrapping: true,
  mode: 'jsx',
  readOnly: true,
  theme: 'material',
  viewportMargin: Infinity,
};

export default CodeBlock;
