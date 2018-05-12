import React from 'react';
import './Nav.css';
import cs from 'classnames';
import { MobileNavButton } from '../MobileNavButton';

export class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
    };
  }

  menuToggleHandler = e => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const { title, children } = this.props;
    const { isExpanded } = this.state;

    return (
      <nav className="SideNav">
        <div className="SidebarNavHeaderContainer">
          <MobileNavButton isActive={this.state.isExpanded} onClick={this.menuToggleHandler} />
          <h1 className="SideNavHeader">{title}</h1>
        </div>
        <div
          id="expandable"
          className={cs('SidebarNavContent', {
            SidebarNavContentExpanded: isExpanded,
          })}
          aria-hidden={isExpanded}
          aria-live="polite"
        >
          {children}
        </div>
      </nav>
    );
  }
}
