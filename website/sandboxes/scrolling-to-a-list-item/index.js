import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { FixedSizeList as List } from 'react-window';

import './styles.css';

const Row = ({ index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
    Row {index}
  </div>
);

class Example extends Component {
  listRef = React.createRef();

  render() {
    return (
      <Fragment>
        <div>
          <button className="ExampleButton" onClick={this.scrollToRow200Auto}>
            Scroll to row 200 (align: auto)
          </button>
          <button className="ExampleButton" onClick={this.scrollToRow250Smart}>
            Scroll to row 250 (align: smart)
          </button>
          <button className="ExampleButton" onClick={this.scrollToRow300Center}>
            Scroll to row 300 (align: center)
          </button>
        </div>
        <List
          className="List"
          height={150}
          itemCount={1000}
          itemSize={35}
          ref={this.listRef}
          width={300}
        >
          {Row}
        </List>
      </Fragment>
    );
  }

  scrollToRow200Auto = () => {
    this.listRef.current.scrollToItem(200);
  };
  scrollToRow250Smart = () => {
    this.listRef.current.scrollToItem(250, 'smart');
  };
  scrollToRow300Center = () => {
    this.listRef.current.scrollToItem(300, 'center');
  };
}

ReactDOM.render(<Example />, document.getElementById('root'));
