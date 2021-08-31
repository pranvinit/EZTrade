import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import styles from './singleItem.module.css';
import axios from 'axios';
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

    const getItem = async () => {
        try {
            const response = await axios({
                method: 'POST',
                url: `/item/${itemId}`,
                data: { id: itemId }
            });
            setItem(response.data)
            setLoading(false);
        } catch (err) {
            setError(true)
        }
    }

    useEffect(() => {
        getItem()
        console.log(userProfile)
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
        setOpen(true);
    }

    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    //if item already exist in cart
    const [alreadyInCart, setAlreadyInCart] = useState(false);
    useEffect(() => {
        data.cartItems.map(doc => doc._id === item._id ? setAlreadyInCart(true) : setAlreadyInCart(false))
    }, [data])

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
                        <AlertComponent message={response.message} operation={response.operation} open={open} changeOpen={changeOpen} />
                        <div id={styles.userActions}>
                            <div id={styles.userOptions}>
                                <Button onClick={handleAddToCart} variant="outlined" color="primary" size="large" disabled={userProfile.login && alreadyInCart} startIcon={<ShoppingCart />}>{alreadyInCart ? 'Added to cart' : 'Add to cart'}</Button>
                                <Button variant="outlined" color="primary" size="large" disabled={!userProfile.login} startIcon={<Receipt />}>Buy now</Button>
                            </div>
                            {userProfile.login && <div id={styles.userAddress}>
                                <span>Delivery address</span>
                                <span>{userProfile.data.userAddress}</span>
                            </div>}
                        </div>
                    </div>
                    <div id={styles.itemInfo}>
                        <div id={styles.itemTitle}>
                            <span>{item.title}</span>
                        </div>
                        <div id={styles.itemMeta}>
                            <div className={styles.itemMetaClass} id={styles.itemReviews}>
                                <span>4.5</span>
                                <span>22 reviews</span>
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

                        <div id={styles.itemDescription}>
                            <span className={styles.itemTextHeadings}>Item description</span>
                            <span>{item.description}</span>

                        </div>
                        <div id={styles.itemDetails}>
                            <span className={styles.itemTextHeadings}>Item details</span>
                            <span>{item.details}</span>
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
                <div style={{ backgroundColor: 'violet' }}>
                    <h1>This is for a test</h1>
                    <h1>This is for a test</h1>
                    <h1>This is for a test</h1>
                    <h1>This is for a test</h1>
                    <h1>This is for a test</h1>
                </div>
            </div>
        )
    }
}
