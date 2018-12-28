import React, { Component } from "react";

// Step 1: Import shouldComponentUpdate from react-window
import { shouldComponentUpdate } from "react-window";

class Row extends Component {
  // Step 2: Bind the sCU method to the component instance
  shouldComponentUpdate = shouldComponentUpdate.bind(this);

  render() {
    const { index, style } = this.props;

    return <div style={style}>Row {index}</div>;
  }
}
