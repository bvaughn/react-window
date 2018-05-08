import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import './SubMenu.css';

export const SubMenu = ({ items, title, activeClassName, className }) => (
  <div className={className}>
    <h2 className="SideNavSectionHeader">{title}</h2>
    <ul className="SideNavLinkList">
      {items.map(({ to, content }) => (
        <li className="SideNavLinkListItem" key={to}>
          <Link
            activeClassName={activeClassName}
            className="SideNavLink"
            to={to}
          >
            {content}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
