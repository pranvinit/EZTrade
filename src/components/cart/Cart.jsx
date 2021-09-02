import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField } from '@material-ui/core';
import { Delete, Receipt } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
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

    const history = useHistory();

    const handleRemoveItem = (id) => {
        const removeItem = async () => {
            try {
                await axios({
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

    const [quantity, setQuantity] = useState({})

    console.log(quantity)

    const handleQuantity = (e, id) => {
        const value = e.currentTarget.value;
        if (!value || value == 0) {
            setQuantity(prev => ({
                ...prev,
                [id]: 1
            }))
        } else if (value > 100) {
            setQuantity(prev => ({
                ...prev,
                [id]: 100
            }))
        } else {
            setQuantity(prev => ({
                ...prev,
                [id]: Number(value)
            }))
        }
    }

    const handlePendingOrder = (item) => {
        const pendingOrder = async () => {
            try {
                await axios({
                    method: 'POST',
                    url: '/cart',
                    data: { user: data._id, item: { ...item, quantity: quantity }, operation: 'addToPending' }
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

    if (!userProfile.login) {
        return (
            <div>
                <h1>Login to access cart</h1>
            </div>
        )
    }
    return (
        <div id={styles.cartContainer}>
            {data.cartItems.length ? <Alert id={styles.alert} severity="info">Cart items</Alert> : <Alert id={styles.alert} severity="info">No items in cart</Alert>}
            <AlertComponent message='Something went wrong' operation='warning' open={open} changeOpen={changeOpen} />
            {data.cartItems.map((item, index) => {
                const discount = ((item.price - item.discountedPrice) / item.price) * 100;
                return (
                    <div id={styles.cartItemContainer} key={index}>
                        <div id={styles.itemImage}>
                            <img src={item.paths[0]} alt={item.title} />
                        </div>
                        <div id={styles.pricing}>
                            <div id={styles.price}>
                                <span>&#8377;{item.discountedPrice * (quantity[item._id] || 1)}</span>
                                <span>&#8377;{item.price * (quantity[item._id] || 1)}</span>
                                <span>{discount.toFixed(0)}% off</span>
                            </div>
                            <div>
                                <TextField onChange={(e) => handleQuantity(e, item._id)} id="outlined-basic" label="Quantity" variant="outlined" defaultValue={quantity[item._id] || 1} />
                            </div>
                        </div>
                        <div id={styles.itemInfo}>
                            <span>{item.title}</span>
                            <span>{item.description.length > 250 ? item.description.substr(0, 250) + '...' : item.description}</span>
                        </div>
                        <div id={styles.buttonContainer}>
                            <Button onClick={() => handlePendingOrder(item)} color="primary" variant="outlined" size="large" startIcon={<Receipt />}>Confirm order</Button>
                            <Button onClick={() => handleRemoveItem(item._id)} color="secondary" variant="outlined" size="large" startIcon={<Delete />}>Remove item</Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
