import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import Method from '../../components/Method';

import styles from './shared.module.css';

import CODE from '../../code/shouldComponentUpdate.js';

export default () => (
  <Method name="shouldComponentUpdate">
    <p>
      Custom{' '}
      <a href="https://reactjs.org/docs/react-component.html#shouldcomponentupdate">
        <code>shouldComponentUpdate</code>
      </a>{' '}
      implementation for class components. If your item renderer is a functional
      component, use the{' '}
      <Link to="/api/areEqual">
        <code>areEqual</code>
      </Link>{' '}
      comparison method instead.
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
