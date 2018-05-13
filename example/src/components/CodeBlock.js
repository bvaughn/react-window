import React from 'react';

import '../material-dark-atom-theme.css';

const CodeBlock = ({ value }) => (
  <code dangerouslySetInnerHTML={{__html: value}} />
);

export default CodeBlock;
