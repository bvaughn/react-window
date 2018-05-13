import React from 'react';

import './CodeBlock.css';

const CodeBlock = ({ value }) => (
  <code dangerouslySetInnerHTML={{__html: value}} />
);

export default CodeBlock;
