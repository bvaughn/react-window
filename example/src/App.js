import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Nav } from './components/Nav';
import { SubMenu } from './components/SubMenu';

// Routes
import DyanmicListExample from './routes/examples/DynamicList';
import FixedSizeGridApi from './routes/api/FixedSizeGrid';
import FixedSizeListApi from './routes/api/FixedSizeList';
import FixedSizeGridExample from './routes/examples/FixedSizeGrid';
import FixedSizeListExample from './routes/examples/FixedSizeList';
import ListWithScrollingIndicatorExample from './routes/examples/ListWithScrollingIndicator';
import ScrollToItemExample from './routes/examples/ScrollToItem';

import './App.css';

const NavExamples = [
  { to: '/examples/list/fixed-size', content: 'Basic List' },
  { to: '/examples/list/dyanmic', content: 'Dynamic List' },
  { to: '/examples/grid/fixed-size', content: 'Basic Grid' },
  {
    to: '/examples/list/scrolling-indicators',
    content: 'Scrolling indicators',
  },
  { to: '/examples/list/scroll-to-cell', content: 'Scrolling to an item' },
];

const ApiExamples = [
  { to: '/api/FixedSizeList', content: <code>&lt;FixedSizeList&gt;</code> },
  { to: '/api/FixedSizeGrid', content: <code>&lt;FixedSizeGrid&gt;</code> },
];

export default function App() {
  return (
    <Router>
      <div className="App">
        <Nav title="react-virtualized">
          <SubMenu
            title="Examples"
            activeClassName="SideNavLinkActiveDark"
            items={NavExamples}
            className="NavExamples"
          />
          <SubMenu
            title="API"
            activeClassName="SideNavLinkActiveLight"
            items={ApiExamples}
            className="NavApi"
          />
        </Nav>
        <main className="Main">
          <Route
            exact
            path="/"
            render={() => <Redirect to="/examples/list/fixed-size" />}
          />

          <Route
            path="/examples/list/fixed-size"
            component={FixedSizeListExample}
          />
          <Route path="/examples/list/dyanmic" component={DyanmicListExample} />
          <Route
            path="/examples/grid/fixed-size"
            component={FixedSizeGridExample}
          />
          <Route
            path="/examples/list/scrolling-indicators"
            component={ListWithScrollingIndicatorExample}
          />
          <Route
            path="/examples/list/scroll-to-cell"
            component={ScrollToItemExample}
          />

          <Route path="/api/FixedSizeList" component={FixedSizeListApi} />
          <Route path="/api/FixedSizeGrid" component={FixedSizeGridApi} />
        </main>
      </div>
    </Router>
  );
}
