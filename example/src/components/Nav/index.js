import React from 'react';
import './Nav.css';
import cs from 'classnames';
import { Hamburger } from '../svg/Hamburger';

export class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  menuToggleHandler = e => {
    this.setState({ open: !this.state.open });

    return false;
  };

  render() {
    const { title, children } = this.props;
    const { open } = this.state;

    return (
      <nav className="SideNav">
        <h1 className="SideNavHeader">
          <span>{title}</span>
          <a
            onClick={this.menuToggleHandler}
            tabIndex={0}
            role="button"
            aria-expanded={open}
            aria-controls="expandable"
          >
            <Hamburger />
          </a>
        </h1>
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
