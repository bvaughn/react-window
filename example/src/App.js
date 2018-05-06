import React from "react";
import { HashRouter as Router, Route, NavLink as Link, Redirect } from "react-router-dom";

// Routes
import FixedSizeGridApi from "./routes/api/FixedSizeGrid";
import FixedSizeListApi from "./routes/api/FixedSizeList";
import FixedSizeGridExample from "./routes/examples/FixedSizeGrid";
import FixedSizeListExample from "./routes/examples/FixedSizeList";
import FixedSizeListWithScrollingIndicatorExample from "./routes/examples/FixedSizeListWithScrollingIndicator";
import ScrollToItemExample from "./routes/examples/ScrollToItem";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="App">
        <nav className="SideNav">
          <h1 className="SideNavHeader">react-virtualized</h1>
          <h2 className="SideNavSectionHeader">Examples</h2>
          <ul className="SideNavLinkList">
            <li className="SideNavLinkListItem">
              <Link activeClassName="SideNavLinkActiveDark" className="SideNavLink" to="/examples/list/fixed-size">
                Basic List
              </Link>
            </li>
            <li className="SideNavLinkListItem">
              <Link activeClassName="SideNavLinkActiveDark" className="SideNavLink" to="/examples/grid/fixed-size">
                Basic Grid
              </Link>
            </li>
            <li className="SideNavLinkListItem">
              <Link activeClassName="SideNavLinkActiveDark" className="SideNavLink" to="/examples/list/scrolling-indicators">
                Scrolling indicators
              </Link>
            </li>
            <li className="SideNavLinkListItem">
              <Link activeClassName="SideNavLinkActiveDark" className="SideNavLink" to="/examples/list/scroll-to-cell">
                Scrolling to an item
              </Link>
            </li>
          </ul>
          <h2 className="SideNavSectionHeader">API</h2>
          <ul className="SideNavLinkList">
            <li className="SideNavLinkListItem">
              <Link activeClassName="SideNavLinkActiveLight" className="SideNavLink" to="/api/FixedSizeList">
                <code>&lt;FixedSizeList&gt;</code>
              </Link>
            </li>
            <li className="SideNavLinkListItem">
              <Link activeClassName="SideNavLinkActiveLight" className="SideNavLink" to="/api/FixedSizeGrid">
                <code>&lt;FixedSizeGrid&gt;</code>
              </Link>
            </li>
          </ul>
        </nav>
        <main className="Main">
          <Route exact path="/" render={() => <Redirect to="/examples/list/fixed-size"/>} />

          <Route path="/examples/list/fixed-size" component={FixedSizeListExample} />
          <Route path="/examples/grid/fixed-size" component={FixedSizeGridExample} />
          <Route path="/examples/list/scrolling-indicators" component={FixedSizeListWithScrollingIndicatorExample} />
          <Route path="/examples/list/scroll-to-cell" component={ScrollToItemExample} />

          <Route path="/api/FixedSizeList" component={FixedSizeListApi} />
          <Route path="/api/FixedSizeGrid" component={FixedSizeGridApi} />
        </main>
      </div>
    </Router>
  );
}