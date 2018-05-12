import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import './SubMenu.css';

export const SubMenu = ({ items, title, activeClassName, className }) => (
  <div className={className}>
    <h2 className="SideNavSectionHeader">{title}</h2>
    <ul className="SideNavLinkList">
      {items.map(({ path, title }) => (
        <li className="SideNavLinkListItem" key={path}>
          <Link
            activeClassName={activeClassName}
            className="SideNavLink"
            to={path}
          >
            {title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
