import React, { PureComponent } from 'react';
import { VariableSizeList } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE_HORIZONTAL from '../../code/VariableSizeListHorizontal.js';
import CODE_VERTICAL from '../../code/VariableSizeListVertical.js';

import styles from './shared.module.css';

const columnSizes = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowSizes = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

class Item extends PureComponent {
  render() {
    const { index, style } = this.props;

    return (
      <div
        className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
        style={style}
      >
        Item {index}
      </div>
    );
  }
}

export default function() {
  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>Variable Size List</h1>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="variable-size-list-vertical"
        >
          <VariableSizeList
            className={styles.List}
            height={150}
            itemCount={1000}
            itemSize={index => rowSizes[index]}
            width={300}
          >
            {Item}
          </VariableSizeList>
        </ProfiledExample>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_VERTICAL} />
        </div>
      </div>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="variable-size-list-horizontal"
        >
          <VariableSizeList
            className={styles.List}
            direction="horizontal"
            height={75}
            itemCount={1000}
            itemSize={index => columnSizes[index]}
            width={300}
          >
            {Item}
          </VariableSizeList>
        </ProfiledExample>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_HORIZONTAL} />
        </div>
      </div>
    </div>
  );
}
