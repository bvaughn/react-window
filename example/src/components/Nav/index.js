import React from 'react';
import './Nav.css';
import cs from 'classnames';
import { MobileNavButton } from '../MobileNavButton';

export class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  menuToggleHandler = e => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { title, children } = this.props;
    const { open } = this.state;

    return (
      <nav className="SideNav">
        <div className="SidebarNavHeaderContainer">
          <MobileNavButton isActive={this.state.open} onClick={this.menuToggleHandler} />
          <h1 className="SideNavHeader">{title}</h1>
        </div>
        <div
          id="expandable"
          className={cs('SidebarNavContent', {
            full: open,
          })}
          aria-hidden={open}
          aria-live="polite"
        >
          {children}
        </div>
      </nav>
    );
  }
}
