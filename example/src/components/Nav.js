import React from 'react';
import './Nav.css';
import cs from 'classnames';
import { MobileNavButton } from './MobileNavButton';

export class Nav extends React.Component {
  state = {
    isExpanded: false,
  };

  render() {
    const { title, children } = this.props;
    const { isExpanded } = this.state;

    return (
      <nav className="SideNav">
        <div className="SidebarNavHeaderContainer">
          <MobileNavButton isActive={this.state.isExpanded} onClick={this.toggleIsExpanded} />
          <h1 className="SideNavHeader">{title}</h1>
        </div>
        <div
          id="expandable"
          className={cs('SidebarNavContent', {
            SidebarNavContentExpanded: isExpanded,
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
    this.setState({isExpanded: false});
  };

  toggleIsExpanded = () => {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
  };
}
