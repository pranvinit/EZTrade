import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../items.module.css';

//material ui specific
import { ShoppingCart, Payment } from '@material-ui/icons';
import { Fab, CircularProgress } from '@material-ui/core';

import axios from 'axios';

//import link from react router
import { Link } from 'react-router-dom';

//for fetching if item exist in cart
import { fetchUserProfile } from '../../../containers/userAccount/userAccountSlice';


export default function Item({ item }) {
    const userProfile = useSelector((state) => state.userAccount);
    const data = userProfile.data;

    const discount = ((item.price - item.discountedPrice) / item.price) * 100;
    const [counter, setCounter] = useState(false);
    const [imgIndex, setImgIndex] = useState(0);
    const imgIntervalRef = useRef();

    const history = useHistory();
    const dispatch = useDispatch();

    const nextImg = () => {
        let currIndex = imgIndex;
        let nextIndex = ++currIndex % item.paths.length;
        setImgIndex(nextIndex)
    }

    useEffect(() => {
        if (counter) {
            imgIntervalRef.current = setInterval(nextImg, 2000)
        }
        return () => {
            clearInterval(imgIntervalRef.current)
        }
    })
    const handleMouseOut = () => {
        setCounter(false);
        setImgIndex(0);
    }

    const handleAddToCart = () => {
        setIconIndex(1)
        const addToCart = async () => {
            try {
                await axios({
                    method: 'POST',
                    url: '/cart',
                    data: { user: userProfile.data._id, item: item }
                });
                dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));
                setIconIndex(0)
            }
            catch {
                setIconIndex(1);
            }
        }
        addToCart();
    }

    const handlePendingOrder = () => {
        setIconIndex(1)
        const pendingOrder = async () => {
            await axios({
                method: 'POST',
                url: '/cart',
                data: { user: data._id, item: { ...item, quantity: 1 }, operation: 'addToPending' }
            });
            dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));
            setIconIndex(0)
            history.push('/orders')
        }
        pendingOrder();
    }

    //if item already exist in cart
    const [cartDisabled, setCartDisabled] = useState(false);

    //if item is already in pending orders
    const [orderDisabled, setOrderDisabled] = useState(false)

    //add to loading effect
    const [iconIndex, setIconIndex] = useState(0);
    const cartIcon = [<ShoppingCart />, <CircularProgress style={{ color: 'white', padding: '10' }} />];
    const orderIcon = [<Payment />, <CircularProgress style={{ color: 'white', padding: '10' }} />]

    useEffect(() => {
        if (!userProfile.login) {
            setCartDisabled(true);
            setOrderDisabled(true);
        }
        if (userProfile.login) {
            data.cartItems.map(doc => {
                if (doc._id.includes(item._id)) {
                    setCartDisabled(true)
                }
            })
            data.pendingOrders.map(doc => {
                if (doc._id.includes(item._id)) {
                    setCartDisabled(true)
                    setOrderDisabled(true)
                }
            })
        }

    }, [data, item])

    return (
        <div id={styles.itemEntry}>
            <Link className={styles.singleItemLink} to={`/singleItem/${item._id}`}>
                <div id={styles.itemTitleContainer}>
                    <span>{item.title.substr(0, 50)}</span>
                </div>
                <div id={styles.itemPriceContainer}>
                    <span>&#8377;{item.discountedPrice}</span>
                    <span>&#8377;{item.price}</span>
                    <span>{discount.toFixed(0)}% off</span>
                </div>
                <div id={styles.itemImageDiv} onMouseOver={() => setCounter(true)} onMouseOut={handleMouseOut}>
                    <img src={item.paths[imgIndex]} alt={item.title} width="150px" />
                </div></Link>
            <div id={styles.itemOptionsContainer}>
                <span>{item.category}</span>
                <div>
                    <Fab onClick={handleAddToCart} disabled={cartDisabled} color="primary" size="small" aria-label="edit">
                        {cartIcon[iconIndex]}
                    </Fab>
                    <Fab onClick={handlePendingOrder} disabled={orderDisabled} color="primary" size="small" aria-label="edit">
                        {orderIcon[iconIndex]}
                    </Fab>
                </div>
            </div>
            <Link className={styles.singleItemLink} to={`/singleItem/${item._id}`}>
                <div id={styles.itemReviewContainer}>
                    <span className={styles.review}>4.5</span>
                    <span className={styles.review}> 20 reviews</span>
                </div>
            </Link>
        </div>
    )
}
