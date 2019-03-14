import React, { PureComponent } from 'react';
import { VariableSizeList } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';
import { fillArray } from '../../utils';

import CODE_HORIZONTAL from '../../code/VariableSizeListHorizontal.js';
import CODE_VERTICAL from '../../code/VariableSizeListVertical.js';

import styles from './shared.module.css';

const columnSizes = fillArray(1000, () => 75 + Math.round(Math.random() * 50));
const rowSizes = fillArray(1000, () => 25 + Math.round(Math.random() * 50));

class Item extends PureComponent {
  render() {
    const { data, index, style } = this.props;

    return (
      <div
        className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
        style={style}
      >
        {data} {index}
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
            itemData="Row"
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
            height={75}
            itemCount={1000}
            itemData="Column"
            itemSize={index => columnSizes[index]}
            layout="horizontal"
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
