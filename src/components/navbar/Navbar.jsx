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
                        <li className={`${styles.navLi} ${styles.navAddress}`}><LocationOn /> <span>{data.userAddress.substr(0, 40)}</span></li> : <li className={styles.navAddress}><span>Login to make a purchase</span></li>
                    }
                    {!userProfile.login ? < Button variant="outlined" color="primary"><NavLink className={styles.navLi} activeClassName={styles.selected} to='/userAccount'><li>Login</li></NavLink></Button> : < Button variant="outlined" color="primary" onClick={handleLogoutClick}><li className={styles.navLi} >Logout</li></Button>}
                    <Button variant="outlined" color="primary"><NavLink className={styles.navLi} activeClassName={styles.selected} to='/sell'><li>Sell</li></NavLink></Button>
                    <Button variant="outlined" color="primary" startIcon={<ShoppingCart style={{ color: 'white' }} />}><NavLink className={styles.navLi} activeClassName={styles.selected} to='/cart'><li>Cart</li></NavLink></Button>
                    <Button variant="outlined" color="primary" startIcon={<Receipt style={{ color: 'white' }} />}><NavLink className={styles.navLi} activeClassName={styles.selected} to='/orders'><li>Orders</li></NavLink></Button>
                </ul>
            </div>
        </div >
    )
}
