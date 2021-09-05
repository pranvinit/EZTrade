import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router';
import styles from './singleItem.module.css';
import axios from 'axios';
//importing comments and ratings
import Comments from '../../components/comments/Comments';
import Ratings from '../../components/ratings/Rating';
//material ui specific
import { Button } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { ShoppingCart, Receipt } from '@material-ui/icons';

//importing utils
import AlertComponent from '../../utils/AlertComponent';

//for fetching if item exist in cart
import { fetchUserProfile } from '../../containers/userAccount/userAccountSlice';

export default function SingleItem() {
    const [error, setError] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const itemId = location.pathname.split('/')[2];

    const [item, setItem] = useState({})
    const discount = ((item.price - item.discountedPrice) / item.price) * 100;
    const userProfile = useSelector((state) => state.userAccount);
    const data = userProfile.data;

    const history = useHistory();

    const getItem = async () => {
        try {
            const response = await axios.get(`/item/${itemId}`);
            setItem(response.data)
            setLoading(false);
        } catch (err) {
            setError(true)
        }
    }

    useEffect(() => {
        getItem()
    }, [itemId])

    const [extendedImgIndex, setExtendedImgIndex] = useState(0);

    const handleImgPreviewClick = (index) => {
        setExtendedImgIndex(index);
    }

    const [response, setResponse] = useState({})
    const handleAddToCart = () => {
        const addToCart = async () => {
            try {
                await axios({
                    method: 'POST',
                    url: '/cart',
                    data: { user: userProfile.data._id, item: item }
                });
                setResponse(prev => ({
                    ...prev,
                    message: 'Item added to cart',
                    operation: 'success'
                }))
                setOpen(true);
                dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));

            } catch (err) {
                setResponse(prev => ({
                    ...prev,
                    message: 'Failed to add item to the cart',
                    operation: 'warning'
                }))
            }
        }
        addToCart();
    }

    const handlePendingOrder = () => {
        const pendingOrder = async () => {
            try {
                await axios({
                    method: 'POST',
                    url: '/cart',
                    data: { user: data._id, item: { ...item, quantity: 1 }, operation: 'addToPending' }
                });
                dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));
                history.push('/orders')

            } catch (err) {
                setOpen(true);
            }
        }
        pendingOrder();
    }


    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    //if item already exist in cart
    const [cartText, setCartText] = useState('Add to cart')
    const [cartDisabled, setCartDisabled] = useState(false);

    //if item is already in pending orders
    const [orderDisabled, setOrderDisabled] = useState(false)
    const [orderText, setOrderText] = useState('Buy now');

    useEffect(() => {
        if (!userProfile.login) {
            setCartDisabled(true);
            setOrderDisabled(true);
        }
        if (userProfile.login) {
            data.cartItems.map(doc => {
                if (doc._id.includes(item._id)) {
                    setCartDisabled(true)
                    setCartText('Added to cart')
                }
            })
            data.pendingOrders.map(doc => {
                if (doc._id.includes(item._id)) {

                    setCartDisabled(true)
                    setCartText('Order pending')

                    setOrderDisabled(true)
                    setOrderText('Order pending')
                }
            })
        }

    }, [data, item])

    const [rating, setRating] = useState(0);
    const ratingContainer = useRef();

    useEffect(() => {
        if (item.ratings) {
            const totalRatings = Array.from(item.ratings.map(doc => doc.rating)).reduce((a, b) => a + b, 0)
            const avgRatings = (totalRatings / item.ratings.length).toFixed(1)
            setRating(avgRatings)
        }
        if (!loading) {
            if (rating > 0 && rating < 2) {
                ratingContainer.current.style.backgroundColor = '#ff6161'
            }
            else if (rating >= 2 && rating <= 3.5) {
                ratingContainer.current.style.backgroundColor = '#ff9f00'
            }
            else if (rating > 2) {
                ratingContainer.current.style.backgroundColor = '#388e3c'
            }
        }
    }, [item, rating])

    if (error) {
        return (
            <div id={styles.errorId}>
                <span>Failed to fetch the item</span>
            </div>
        )
    }
    else if (loading) {
        return (
            <div id={styles.spinnerContainer}>
                {loading && <CircularProgress />}
            </div>
        )
    }
    else {
        return (
            <div id={styles.singleItemContainer}>
                <div id={styles.itemDataContainer}>
                    <div id={styles.itemMedia}>

                        {item.paths && <div id={styles.extImgDiv}><img src={item.paths[extendedImgIndex]} alt={item.title} width="500px" /></div>}

                        <div id={styles.imgPreviewContainer}>
                            {item.paths &&
                                item.paths.map((path, index) => {
                                    return <div id={styles.imgPreview} onClick={() => handleImgPreviewClick(index)} key={index}><img src={path} alt={item.title} width="150px" /></div>
                                })
                            }
                        </div>
                        <div id={styles.userActions}>
                            <AlertComponent message={response.message} operation={response.operation} open={open} changeOpen={changeOpen} />
                            <div id={styles.userOptions}>
                                <Button onClick={handleAddToCart} variant="outlined" color="primary" size="large" disabled={cartDisabled} startIcon={<ShoppingCart />}>{!userProfile.login ? 'Add to cart' : cartText}</Button>
                                <Button onClick={handlePendingOrder} variant="outlined" color="primary" size="large" disabled={orderDisabled} startIcon={<Receipt />}>{!userProfile.login ? 'Buy now' : orderText}</Button>
                            </div>
                            {userProfile.login && <div id={styles.userAddress}>
                                <span>Delivery address</span>
                                <span>{userProfile.data.userAddress}</span>
                            </div>}
                        </div>
                    </div>
                    <div id={styles.itemInfo}>
                        <div id={styles.metaContainer}>
                            <div id={styles.itemTitle}>
                                <span>{item.title}</span>
                            </div>
                            <div id={styles.itemMeta}>
                                <div className={styles.itemMetaClass} id={styles.itemReviews}>
                                    {item.ratings.length !== 0 ? <span ref={ratingContainer} id={styles.rateCount}>{rating}</span> : <span className={styles.noReview}>No ratings</span>}
                                    <span>{item.comments.length} reviews</span>
                                </div>
                                <div className={styles.itemMetaClass} id={styles.extraInfo}>
                                    <span>{item.date}</span>
                                    <span>{item.category}</span>
                                </div>
                            </div>

                            <div id={styles.price}>
                                <span>&#8377;{item.discountedPrice}</span>
                                <span>&#8377;{item.price}</span>
                                <span>{discount.toFixed(0)}% off</span>
                            </div>
                        </div>

                        <div id={styles.itemDescription}>
                            <span className={styles.itemTextHeadings}>Item description</span>
                            <div>
                                <span>{item.description}</span>
                            </div>
                        </div>
                        <div id={styles.itemDetails}>
                            <span className={styles.itemTextHeadings}>Item details</span>
                            <div>
                                <span>{item.details}</span>
                            </div>
                        </div>

                        <div id={styles.sellerInfoContainer}>
                            <span className={styles.itemTextHeadings}>Seller information</span>
                            <div id={styles.sellerInfo}>
                                <span>Shop Name - {item.sellerShopName}</span>
                                <span>Name - {item.sellerName}</span>
                                <span>Contact - {item.sellerContact}</span>
                                <span>Shop address - {item.shopAddress}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.reviewsContainer}>
                    {userProfile.login ? <span>Comment and Ratings</span> : <span>Login to Rate or Comment</span>}
                    {userProfile.login && <Ratings item={item} reload={getItem} />}
                    <Comments item={item} reload={getItem} />
                </div>
            </div>
        )
    }
}
