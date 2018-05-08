import React from "react";
import CodeMirror from "react-codemirror";

import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "./CodeBlock.css";

const CodeBlock = ({ value }) => (
  <div className="CodeBlock">
    <CodeMirror options={OPTIONS} value={value.trim()} />
  </div>
);

const OPTIONS = {
  lineWrapping: true,
  mode: "jsx",
  readOnly: true,
  theme: "material"
};

export default CodeBlock;