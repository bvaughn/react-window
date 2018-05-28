import React from 'react';
import { NavLink as Link } from 'react-router-dom';

import styles from './SubMenu.module.css';

export const SubMenu = ({ isActiveDark, items, title }) => (
  <div>
    <h2 className={styles.SideNavSectionHeader}>{title}</h2>
    <ul className={styles.SideNavLinkList}>
      {items.map(({ path, title }) => (
        <li className={styles.SideNavLinkListItem} key={path}>
          <Link
            activeClassName={
              isActiveDark ? styles.SideNavLinkActiveDark : styles.SideNavLinkActiveLight
            }
            className={styles.SideNavLink}
            to={path}
          >
            {title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
