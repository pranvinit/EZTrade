import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../items.module.css';

//material ui specific
import { ShoppingCart, Payment, Edit, DeleteOutline } from '@material-ui/icons';
import { Fab, CircularProgress, Button } from '@material-ui/core';

import axios from 'axios';

//import link from react router
import { Link } from 'react-router-dom';

//for fetching if item exist in cart
import { fetchUserProfile } from '../../../containers/userAccount/userAccountSlice';


export default function Item({ item, seller, editItem, deleteItem }) {
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

    const handleConfirm = async (option) => {
        if (option === 'edit') {
            setShowEdit(false)
            editItem(item)
        }
        if (option === 'delete') {
            const delItem = async () => {
                try {
                    const response = await axios({
                        method: 'POST',
                        url: '/addItem',
                        data: { operation: 'delete', id: item._id }
                    });
                    deleteItem(true, response.data.message)

                } catch (err) {
                    deleteItem(false);
                }
            }
            delItem();
        }
    }

    //popup options
    const [showEdit, setShowEdit] = useState(false);
    const [showDel, setShowDel] = useState(false);
    const edit = (
        <div className={styles.popupContainer}>
            <span>Do you want to edit this item?</span>
            <div className={styles.sellerActions}>
                <Button variant="outlined" color="primary" onClick={() => setShowEdit(false)}>cancel</Button>
                <Button variant="outlined" color="secondary" onClick={() => handleConfirm('edit')}>edit</Button>
            </div>
        </div>
    )
    const del = (
        <div className={styles.popupContainer}>
            <span>Do you want to delete this item?</span>
            <div className={styles.sellerActions}>
                <Button variant="outlined" color="primary" onClick={() => setShowDel(false)}>cancel</Button>
                <Button variant="outlined" color="secondary" onClick={() => handleConfirm('delete')}>delete</Button>
            </div>
        </div>
    )

    const ratingContainer = useRef();
    const [rating, setRating] = useState(0);
    useEffect(() => {
        const totalRatings = Array.from(item.ratings.map(doc => doc.rating)).reduce((a, b) => a + b, 0)
        const avgRatings = (totalRatings / item.ratings.length).toFixed(1)
        setRating(avgRatings)
        if (rating > 0 && rating < 2) {
            ratingContainer.current.style.backgroundColor = '#ff6161'
        }
        else if (rating >= 2 && rating <= 3.5) {
            ratingContainer.current.style.backgroundColor = '#ff9f00'
        }
        else if (rating > 2) {
            ratingContainer.current.style.backgroundColor = '#388e3c'
        }
    }, [item, rating])

    return (
        <div id={styles.itemEntry}>
            {showEdit && edit}
            {showDel && del}
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
                {!seller && <div>
                    <Fab onClick={handleAddToCart} disabled={cartDisabled} color="primary" size="small" aria-label="cart">
                        {cartIcon[iconIndex]}
                    </Fab>
                    <Fab onClick={handlePendingOrder} disabled={orderDisabled} color="primary" size="small" aria-label="order">
                        {orderIcon[iconIndex]}
                    </Fab>
                </div>}
                {seller && <div>
                    <Fab onClick={() => showEdit ? setShowEdit(false) : setShowEdit(true)} color="secondary" size="small" aria-label="edit">
                        <Edit />
                    </Fab>
                    <Fab onClick={() => showDel ? setShowDel(false) : setShowDel(true)} color="secondary" size="small" aria-label="delete">
                        <DeleteOutline />
                    </Fab>
                </div>}
            </div>
            <Link className={styles.singleItemLink} to={`/singleItem/${item._id}`}>
                <div id={styles.itemReviewContainer}>
                    {item.ratings.length !== 0 ? <span ref={ratingContainer} className={styles.review} id={styles.rateCount}>{rating}</span> : <span className={styles.noReview}>No ratings</span>}
                    <span className={styles.review}> {item.comments.length} reviews</span>
                </div>
            </Link>
        </div>
    )
}
