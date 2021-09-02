import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useHistory } from 'react-router-dom';
import styles from './navbar.module.css';
import Button from '@material-ui/core/Button';
import { ShoppingCart, Receipt } from '@material-ui/icons';

//material ui specific
import { LocationOn } from '@material-ui/icons';
//importing logout action creator
import { logout } from '../../containers/userAccount/userAccountSlice';

export default function Navbar() {
    const userProfile = useSelector((state) => state.userAccount);
    const data = userProfile.data;
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogoutClick = () => {
        localStorage.removeItem('userJwtToken');
        sessionStorage.removeItem('userTempAuth');
        dispatch(logout());
        history.push('/')
    }

    return (
        <div id={styles.mainNavbar}>
            <div id={styles.navMeta}>
                <Link className={styles.homeLink} to="/">
                    <div id={styles.logoContainer}>
                        <span>ezt</span>
                    </div>
                </Link>
                {userProfile.login &&
                    <div id={styles.nameDiv}>
                        <span>Welcome {data.name}</span>
                    </div>
                }
            </div>
            <div id={styles.navListContainer}>
                <ul id={styles.navList}>
                    {userProfile.login ?
                        <li className={`${styles.navLi} ${styles.navAddress}`}><LocationOn style={{ color: 'white' }} /> <span>{data.userAddress.substr(0, 40)}</span></li> : <li className={styles.navAddress}><Link className={styles.loginLabel} to='/userAccount'>Login to make a purchase</Link></li>
                    }
                    {!userProfile.login ? <NavLink className={styles.navLi} activeClassName={styles.selected} to='/userAccount'> < Button variant="outlined" color="primary"><li>Login</li></Button></NavLink> : < Button className={styles.navLi} variant="outlined" color="primary" onClick={handleLogoutClick}><li>Logout</li></Button>}
                    <NavLink className={styles.navLi} activeClassName={styles.selected} to='/sell'><Button variant="outlined" color="primary"><li>Sell</li></Button></NavLink>
                    <NavLink className={styles.navLi} activeClassName={styles.selected} to='/cart'><Button variant="outlined" color="primary" startIcon={<ShoppingCart style={{ color: 'white' }} />}><li>Cart</li></Button></NavLink>
                    <NavLink className={styles.navLi} activeClassName={styles.selected} to='/orders'><Button variant="outlined" color="primary" startIcon={<Receipt style={{ color: 'white' }} />}><li>Orders</li></Button></NavLink>
                </ul>
            </div>
        </div >
    )
}
