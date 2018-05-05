import React, { Component } from "react";
import {
  FixedSizeGrid as Grid,
  FixedSizeList as List
 } from "react-virtualized-v10";
import CodeMirror from "react-codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "./App.css";

const DEFAULT_GRID_PROPS = {
  className: "List",
  columnCount: 1000,
  columnWidth: 100,
  height: 150,
  rowCount: 1000,
  rowHeight: 35,
  width: 300
};

const DEFAULT_LIST_PROPS = {
  cellSize: 35,
  className: "List",
  count: 1000,
  height: 150,
  width: 300,
  children: props => <ListCell {...props} />
};

export default class App extends Component<void, void> {
  grid = React.createRef();
  horizontalList = React.createRef();
  scrollingList = React.createRef();
  verticalList = React.createRef();

  render() {
    return (
      <div className="App">
        <div>
          <label className="ScrollToLabel">Scroll to:</label>
          <button onClick={this.scrollToStart500}>500 (start)</button>
          <button onClick={this.scrollToEnd200}>200 (end)</button>
          <button onClick={this.scrollToCenter300}>300 (center)</button>
          <button onClick={this.scrollToAuto400}>400 (auto)</button>
        </div>

        <div className="Block">
          <div className="BlockHeader">
            Vertical <code>List</code>
          </div>
          <div className="BlockBody">
            <div className="BlockDemo">
              <List {...DEFAULT_LIST_PROPS} ref={this.verticalList} />
            </div>
            <div className="BlockCode">
              <CodeMirror
                options={{ mode: "jsx" }}
                value={`<List
  cellSize={35}
  count={1000}
  height={150}
  width="100%"
>
  {({ key, index, style }) => (
    <div key={key} style={style}>
      {/* Render item at index ... */}
    </div>
  )}
</List>`}
              />
            </div>
          </div>
        </div>

        <div className="Block">
          <div className="BlockHeader">
            Horizontal <code>List</code>
          </div>
          <div className="BlockBody">
            <div className="BlockDemo">
              <List
                {...DEFAULT_LIST_PROPS}
                cellSize={100}
                direction="horizontal"
                ref={this.horizontalList}
              />
            </div>
            <div className="BlockCode">
              <CodeMirror
                options={{ mode: "jsx" }}
                value={`<List
  cellSize={35}
  count={1000}
  direction="horizontal"
  height={150}
  width={300}
>
  {({ key, index, style }) => (
    <div key={key} style={style}>
      {/* Render item at index ... */}
    </div>
  )}
</List>`}
              />
            </div>
          </div>
        </div>

        <div className="Block">
          <div className="BlockHeader">
            <code>List</code> with <code>isScrolling</code> indicator
          </div>
          <div className="BlockBody">
            <div className="BlockDemo">
              <List
                {...DEFAULT_LIST_PROPS}
                useIsScrolling
                ref={this.scrollingList}
              />
            </div>
            <div className="BlockCode">
              <CodeMirror
                options={{ mode: "jsx" }}
                value={`<List
  cellSize={35}
  count={1000}
  useIsScrolling
  height={150}
  width="100%"
>
  {({ key, index, isScrolling, style }) => (
    <div key={key} style={style}>
      {/* Render item at index ... */}
      {isScrolling && (
        {/* Render scrolling indicator ... */}
      )}
    </div>
  )}
</List>`}
              />
            </div>
          </div>
        </div>

        <div className="Block">
          <div className="BlockHeader">
            <code>Grid</code>
          </div>
          <div className="BlockBody">
            <div className="BlockDemo">
              <Grid {...DEFAULT_GRID_PROPS} ref={this.grid}>
                {props => <GridCell {...props} />}
              </Grid>
            </div>
            <div className="BlockCode">
              <CodeMirror
                options={{ mode: "jsx" }}
                value={`<Grid
  columnCount={1000}
  columnWidth={100}
  height={150}
  rowCount={1000}
  rowHeight={35}
  width={300}
>
  {({ columnIndex, key, rowIndex, style }) => (
    <div key={key} style={style}>
      {/* Render item at rowIndex and columnIndex ... */}
    </div>
  )}
</Grid>`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  scrollToStart500 = () => {
    this.grid.current.scrollToCell({
      columnIndex: 500,
      rowIndex: 500,
      align: "start"
    });
    this.horizontalList.current.scrollToRow(500, "start");
    this.verticalList.current.scrollToRow(500, "start");
    this.scrollingList.current.scrollToRow(500, "start");
  };

  scrollToEnd200 = () => {
    this.grid.current.scrollToCell({
      columnIndex: 200,
      rowIndex: 200,
      align: "end"
    });
    this.horizontalList.current.scrollToRow(200, "end");
    this.verticalList.current.scrollToRow(200, "end");
    this.scrollingList.current.scrollToRow(200, "end");
  };

  scrollToCenter300 = () => {
    this.grid.current.scrollToCell({
      columnIndex: 300,
      rowIndex: 300,
      align: "center"
    });
    this.horizontalList.current.scrollToRow(300, "center");
    this.verticalList.current.scrollToRow(300, "center");
    this.scrollingList.current.scrollToRow(300, "center");
  };

  scrollToAuto400 = () => {
    this.grid.current.scrollToCell({
      columnIndex: 400,
      rowIndex: 400,
      align: "auto"
    });
    this.horizontalList.current.scrollToRow(400, "auto");
    this.verticalList.current.scrollToRow(400, "auto");
    this.scrollingList.current.scrollToRow(400, "auto");
  };
}

class GridCell extends React.PureComponent {
  _renderCounter: number = 0;

  render() {
    const { columnIndex, rowIndex, style } = this.props;

    this._renderCounter++;

    return (
      <div
        className={
          rowIndex % 2
            ? columnIndex % 2
              ? "ListItemOdd"
              : "ListItemEven"
            : columnIndex % 2
              ? "ListItemEven"
              : "ListItemOdd"
        }
        style={style}
      >
        <span>
          r:{rowIndex}, c:{columnIndex}
        </span>
        <small className="ListItemRernCount">[{this._renderCounter}]</small>
      </div>
    );
  }
}

class ListCell extends React.PureComponent {
  _renderCounter: number = 0;

  render() {
    const { index, isScrolling, style } = this.props;

    this._renderCounter++;

    return (
      <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
        <span>Cell {index}</span>
        <span>{isScrolling ? "(scrolling)" : ""}</span>
        <small className="ListItemRernCount">[{this._renderCounter}]</small>
      </div>
    );
  }
}