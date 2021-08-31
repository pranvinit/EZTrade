import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { Delete, Receipt } from '@material-ui/icons';
import styles from './cart.module.css';
import axios from 'axios';

//for fetching cartItems
import { fetchUserProfile } from '../../containers/userAccount/userAccountSlice';

//importing utils
import AlertComponent from '../../utils/AlertComponent';

export default function Cart() {
    const userProfile = useSelector((state) => state.userAccount);
    const data = userProfile.data;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));
    }, [])

    const handleRemoveItem = (id) => {
        const removeItem = async () => {
            try {
                const response = await axios({
                    method: 'POST',
                    url: '/cart',
                    data: { user: data._id, item: id, operation: 'remove' }
                });
                dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));

            } catch (err) {
                setOpen(true);
            }
        }
        removeItem();
    }

    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    if (!userProfile.login) {
        return (
            <div>
                <h1>Login to access cart</h1>
            </div>
        )
    }
    return (
        <div id={styles.cartContainer}>
            <span>Items in cart</span>
            <AlertComponent message='Something went wrong' operation='warning' open={open} changeOpen={changeOpen} />
            {data.cartItems.map((item, index) => {
                const discount = ((item.price - item.discountedPrice) / item.price) * 100;
                return (
                    <div id={styles.cartItemContainer} key={index}>
                        <div id={styles.itemImage}>
                            <img src={item.paths[0]} alt={item.title} />
                        </div>
                        <div id={styles.itemTitle}>
                            <span>{item.title}</span>
                        </div>

                        <div id={styles.price}>
                            <span>&#8377;{item.discountedPrice}</span>
                            <span>&#8377;{item.price}</span>
                            <span>{discount.toFixed(0)}% off</span>
                        </div>
                        <div id={styles.itemDescription}>
                            <span>{item.description}</span>
                        </div>
                        <div id={styles.buttonContainer}>
                            <Button onClick={() => handleRemoveItem(item._id)} color="secondary" variant="contained" startIcon={<Delete />}>Remove item</Button>
                            <Button color="primary" variant="contained" startIcon={<Receipt />}>Place order</Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
