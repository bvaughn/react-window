import React from 'react';
import cs from 'classnames';
import { MobileNavButton } from './MobileNavButton';
import { MobileGitHubButton } from './MobileGitHubButton';

import styles from './Nav.module.css';

export class Nav extends React.Component {
  state = {
    isExpanded: false,
  };

  render() {
    const { title, children } = this.props;
    const { isExpanded } = this.state;

    return (
      <nav className={styles.SideNav}>
        <div className={styles.SidebarNavHeaderContainer}>
          <MobileNavButton
            isActive={this.state.isExpanded}
            onClick={this.toggleIsExpanded}
          />
          <h1 className={styles.SideNavHeader}>
            <a
              className={styles.SideNavHeaderLink}
              href="https://github.com/bvaughn/react-window"
            >
              {title}
            </a>
          </h1>
          <MobileGitHubButton />
        </div>
        <div
          id="expandable"
          className={cs(styles.SidebarNavContent, {
            [styles.SidebarNavContentExpanded]: isExpanded,
          })}
          aria-hidden={isExpanded}
          aria-live="polite"
          onClick={isExpanded ? this.collapse : null}
        >
          {children}
        </div>
      </nav>
    );
  }

  collapse = () => {
    this.setState({ isExpanded: false });
  };

  toggleIsExpanded = () => {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
  };
}
