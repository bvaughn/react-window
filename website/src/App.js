import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Nav } from './components/Nav';
import { SubMenu } from './components/SubMenu';

// Routes
import DynamicSizeListExample from './routes/examples/DynamicSizeList';
import FixedSizeGridApi from './routes/api/FixedSizeGrid';
import FixedSizeGridExample from './routes/examples/FixedSizeGrid';
import FixedSizeListApi from './routes/api/FixedSizeList';
import FixedSizeListExample from './routes/examples/FixedSizeList';
import ListWithScrollingIndicatorExample from './routes/examples/ListWithScrollingIndicator';
import MemoizedListItemsExample from './routes/examples/MemoizedListItemsExample';
import ScrollToItemExample from './routes/examples/ScrollToItem';
import VariableSizeGridApi from './routes/api/VariableSizeGrid';
import VariableSizeGridExample from './routes/examples/VariableSizeGrid';
import VariableSizeListApi from './routes/api/VariableSizeList';
import VariableSizeListExample from './routes/examples/VariableSizeList';

import styles from './App.module.css';

export default function App() {
  return (
    <Router>
      <div className={styles.App}>
        <Nav title="react-window">
          <SubMenu
            isActiveDark={true}
            items={EXAMPLE_ROUTES}
            title="Examples"
          />
          <SubMenu isActiveDark={false} items={API_ROUTES} title="API" />
        </Nav>
        <main className={styles.Main}>
          <Route
            exact
            path="/"
            render={() => <Redirect to={EXAMPLE_ROUTES[0].path} />}
          />

          {EXAMPLE_ROUTES.map(({ component, path }) => (
            <Route key={path} path={path} component={component} />
          ))}

          {API_ROUTES.map(({ component, path }) => (
            <Route key={path} path={path} component={component} />
          ))}
        </main>
      </div>
    </Router>
  );
}

const EXAMPLE_ROUTES = [
  {
    path: '/examples/list/fixed-size',
    title: 'Fixed Size List',
    component: FixedSizeListExample,
  },
  {
    path: '/examples/list/variable-size',
    title: 'Variable Size List',
    component: VariableSizeListExample,
  },
  {
    path: '/examples/list/dynamic-size',
    title: 'Dynamic Size List',
    component: DynamicSizeListExample,
  },
  {
    path: '/examples/grid/fixed-size',
    title: 'Fixed Size Grid',
    component: FixedSizeGridExample,
  },
  {
    path: '/examples/grid/variable-size',
    title: 'Variable Size Grid',
    component: VariableSizeGridExample,
  },
  {
    path: '/examples/list/scrolling-indicators',
    title: 'Scrolling indicators',
    component: ListWithScrollingIndicatorExample,
  },
  {
    path: '/examples/list/scroll-to-item',
    title: 'Scrolling to an item',
    component: ScrollToItemExample,
  },
  {
    path: '/examples/list/memoized-list-items',
    title: 'Memoized List items',
    component: MemoizedListItemsExample,
  },
];

const API_ROUTES = [
  {
    path: '/api/FixedSizeList',
    title: 'FixedSizeList',
    component: FixedSizeListApi,
  },
  {
    path: '/api/VariableSizeList',
    title: 'VariableSizeList',
    component: VariableSizeListApi,
  },
  {
    path: '/api/FixedSizeGrid',
    title: 'FixedSizeGrid',
    component: FixedSizeGridApi,
  },
  {
    path: '/api/VariableSizeGrid',
    title: 'VariableSizeGrid',
    component: VariableSizeGridApi,
  },
];
