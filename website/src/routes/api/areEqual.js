import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import Method from '../../components/Method';

import styles from './shared.module.css';

import CODE from '../../code/areEqual.js';

export default () => (
  <Method name="areEqual">
    <p>
      Custom comparison function for{' '}
      <a href="https://reactjs.org/docs/react-api.html#reactmemo">
        <code>React.memo</code>
      </a>
      . If your item renderer is a class component, use the{' '}
      <Link to="/api/shouldComponentUpdate">
        <code>shouldComponentUpdate</code>
      </Link>{' '}
      method instead.
    </p>
    <p>
      This function knows to compare individual <code>style</code> props and
      ignore the wrapper object in order to avoid unnecessarily re-rendering
      when cached style objects are reset.
    </p>
    <div className={styles.CodeBlockWrapper}>
      <CodeBlock value={CODE} />
    </div>
    <p>
      <strong>This is an advanced performance optimization.</strong> It is not
      necessary in most cases.
    </p>
  </Method>
);
