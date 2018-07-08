import cn from 'classnames';
import React, { Component } from 'react';
import { DynamicSizeList } from 'react-window';
// import randomWords from 'random-words';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE_HORIZONTAL from '../../code/DynamicSizeListHorizontal.js';
import CODE_VERTICAL from '../../code/DynamicSizeListVertical.js';

import styles from './shared.module.css';

const words = ['cat', 'kitten', 'feline', 'kitty'];
const randomWords = ({ min, max }) => {
  const target = min + Math.round(Math.random() * (max - min));
  return new Array(target).fill(true).map(() => words[Math.floor(Math.random() * words.length)]);
}

const names = [
  'Stasia',
  'Shaunta',
  'Lavona',
  'Felica',
  'Glinda',
  'Percy',
  'Irina',
  'Noriko',
  'Evette',
  'Margene',
  'Cordia',
  'Karmen',
  'Kitty',
  'Rima',
  'Dessie',
  'Kory',
  'Oda',
  'Alesia',
  'Loura',
  'Lucius',
];

const items = new Array(500).fill(true).map(() => ({
  paragraph: randomWords({ min: 3, max: 30 }).join(', '),
  name: names[Math.floor(Math.random() * names.length)],
}));

const itemRowRenderer = ({ index, style }) => (
  <div
    className={
      index % 2 ? styles.DynamicListItemOdd : styles.DynamicListItemEven
    }
    style={style}
  >
    {index}: {items[index].paragraph}
  </div>
);

const itemColumnRenderer = ({ index, style }) => (
  <div
    className={cn(
      index % 2 ? styles.DynamicListItemOdd : styles.DynamicListItemEven,
      styles.ListColumn
    )}
    style={style}
  >
    {index}: {items[index].name}
  </div>
);

export default class ScrollToItem extends Component {
  horizontalListRef = React.createRef();
  verticalListRef = React.createRef();

  render() {
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
            <DynamicSizeList
              className={styles.List}
              height={200}
              itemCount={items.length}
              ref={this.verticalListRef}
              width={300}
            >
              {itemRowRenderer}
            </DynamicSizeList>
          </ProfiledExample>
          <div className={styles.ExampleCode}>
            <CodeBlock value={CODE_VERTICAL} />
          </div>
        </div>
        <div className={styles.Example}>
          <ProfiledExample className={styles.ExampleDemo}>
            <DynamicSizeList
              className={styles.List}
              direction="horizontal"
              height={50}
              itemCount={items.length}
              ref={this.horizontalListRef}
              width={300}
            >
              {itemColumnRenderer}
            </DynamicSizeList>
          </ProfiledExample>
          <div className={styles.ExampleCode}>
            <CodeBlock value={CODE_HORIZONTAL} />
          </div>
        </div>
      </div>
    );
  }

  scrollTo15000Pixels = () => this.verticalListRef.current.scrollTo(15000);
  scrollToRow200Auto = () => this.verticalListRef.current.scrollToItem(200);
}
