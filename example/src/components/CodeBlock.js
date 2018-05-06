import React from "react";
import CodeMirror from "react-codemirror";

import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "./CodeBlock.css";

const CodeBlock = ({ value }) => (
  <div className="CodeBlock">
    <CodeMirror options={{ mode: "jsx", readOnly: true, theme: "material" }} value={value.trim()} />
  </div>
);

export default CodeBlock;