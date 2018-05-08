import React from 'react';
import './Nav.css';
import cs from 'classnames';
import { HamburgerButton } from '../HamburgerButton';

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
          <HamburgerButton clickHandler={this.menuToggleHandler} />
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
