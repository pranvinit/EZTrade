import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './navbar.module.css';
import Button from '@material-ui/core/Button';
import { ShoppingCart } from '@material-ui/icons';
import { Receipt } from '@material-ui/icons';

export default function Navbar() {
    return (
        <div id={styles.mainNavbar}>
            <Link className={styles.homeLink} to="/">
                <div id={styles.logoContainer}>
                    <span>ezt</span>
                </div>
            </Link>
            <div id={styles.navListContainer}>
                <ul id={styles.navList}>
                    <li className={styles.navLi}>Display Address here</li>
                    <Button variant="outlined" color="primary"><NavLink className={styles.navLi} activeClassName={styles.selected} to='/login'><li>Login</li></NavLink></Button>
                    <Button variant="outlined" color="primary"><NavLink className={styles.navLi} activeClassName={styles.selected} to='/sell'><li>Sell</li></NavLink></Button>
                    <Button variant="outlined" color="primary" startIcon={<Receipt style={{ color: 'white' }} />}><NavLink className={styles.navLi} activeClassName={styles.selected} to='/orders'><li>Orders</li></NavLink></Button>
                    <Button variant="outlined" color="primary" startIcon={<ShoppingCart style={{ color: 'white' }} />}><NavLink className={styles.navLi} activeClassName={styles.selected} to='/cart'><li>Cart</li></NavLink></Button>
                </ul>
            </div>
        </div>
    )
}
