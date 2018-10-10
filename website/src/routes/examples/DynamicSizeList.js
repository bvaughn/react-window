import React, { PureComponent } from 'react';
import { DynamicSizeList as List } from 'react-window';
import loremIpsum from 'lorem-ipsum';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE_HORIZONTAL from '../../code/DynamicSizeListHorizontal.js';
import CODE_VERTICAL from '../../code/DynamicSizeListVertical.js';

import styles from './shared.module.css';

var colors = [
  ['#1E88E5', '#90CAF9'],
  ['#6D4C41', '#D7CCC8'],
  ['#212121', '#BDBDBD'],
  ['#388E3C', '#A5D6A7'],
  ['#E53935', '#EF9A9A'],
  ['#F4511E', '#FFAB91'],
  ['#8E24AA', '#E1BEE7'],
  ['#FFD600', '#FFF59D'],
];

const items = new Array(500).fill(true).map(() => {
  const text = loremIpsum({ units: 'paragraphs' });
  return {
    colors: colors[Math.floor(Math.random() * colors.length)],
    paragraph: text,
    sentence: text.substr(0, text.indexOf('.')) + '…',
    words: loremIpsum({ units: 'words' }),
  };
});

class Row extends PureComponent {
  state = {
    isExpanded: true,
  };

  toggleExpanded = () =>
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
    }));

  render() {
    const { index, style } = this.props;
    const { isExpanded } = this.state;

    const item = items[index];

    return (
      <div
        className={
          index % 2 ? styles.DynamicListItemOdd : styles.DynamicListItemEven
        }
        style={{
          display: 'flex',
          ...style,
        }}
      >
        <div
          className={styles.DynamicRowAvatar}
          style={{
            backgroundColor: item.colors[1],
            color: item.colors[0],
          }}
        >
          {index}
        </div>
        <div className={styles.DynamicRowText} onClick={this.toggleExpanded}>
          {isExpanded ? item.paragraph : item.sentence}
        </div>
      </div>
    );
  }
}

class Column extends PureComponent {
  render() {
    const { index, style } = this.props;

    const item = items[index];

    return (
      <div
        className={
          index % 2 ? styles.DynamicListItemOdd : styles.DynamicListItemEven
        }
        style={{
          display: 'flex',
          ...style,
        }}
      >
        <div
          className={styles.DynamicRowAvatar}
          style={{
            backgroundColor: item.colors[1],
            color: item.colors[0],
          }}
        >
          {index}
        </div>
        <div className={styles.DynamicRowText}>{item.words}</div>
      </div>
    );
  }
}

export default class DynamicSizeList extends PureComponent {
  horizontalListRef = React.createRef();
  verticalListRef = React.createRef();

  state = {
    halfSize: false,
  };

  handleToggleResize = () =>
    this.setState(prevState => ({
      halfSize: !prevState.halfSize,
    }));

  scrollTo15000Pixels = () => this.verticalListRef.current.scrollTo(15000);
  scrollToRow200Auto = () => this.verticalListRef.current.scrollToItem(200);

  render() {
    const { halfSize } = this.state;

    return (
      <div className={styles.ExampleWrapper}>
        <h1 className={styles.ExampleHeader}>Dynamic Size List</h1>
        <div className={styles.Example}>
          <ProfiledExample className={styles.ExampleDemo}>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow200Auto}
            >
              Scroll to row 200 (align: auto)
            </button>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollTo15000Pixels}
            >
              Scroll to 15,000px
            </button>
            <button
              className={styles.ExampleButton}
              onClick={this.handleToggleResize}
            >
              Resize list
            </button>
            <List
              className={styles.List}
              height={200}
              itemCount={items.length}
              ref={this.verticalListRef}
              width={halfSize ? '50%' : '100%'}
            >
              {Row}
            </List>
          </ProfiledExample>
          <div className={styles.ExampleCode}>
            <CodeBlock value={CODE_VERTICAL} />
          </div>
        </div>
        <div className={styles.Example}>
          <ProfiledExample className={styles.ExampleDemo}>
            <List
              className={styles.List}
              direction="horizontal"
              height={50}
              itemCount={items.length}
              ref={this.horizontalListRef}
              width={300}
            >
              {Column}
            </List>
          </ProfiledExample>
          <div className={styles.ExampleCode}>
            <CodeBlock value={CODE_HORIZONTAL} />
          </div>
        </div>
      </div>
    );
  }
}
