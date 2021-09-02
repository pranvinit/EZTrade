import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './orders.module.css';
import { Cancel, Payment } from '@material-ui/icons';
import { Button, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import moment from 'moment';
import axios from 'axios';

//for fetching cartItems
import { fetchUserProfile } from '../../containers/userAccount/userAccountSlice';
//importing utils
import AlertComponent from '../../utils/AlertComponent';


export default function Orders() {
    const userProfile = useSelector((state) => state.userAccount)
    const data = userProfile.data;
    const dispatch = useDispatch();

    const handleOrder = (item) => {
        const orderDate = moment().format("MMM Do YY");
        const orderTime = moment().format('LT');
        const confirmOrder = async () => {
            try {
                await axios({
                    method: 'POST',
                    url: '/cart',
                    data: { user: data._id, item: { ...item, paymentMode: paymentMode, orderDate: orderDate, orderTime: orderTime }, operation: 'placeOrder' }
                });
                dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));

            } catch (err) {
                setOpen(true);
            }
        }
        confirmOrder();
    }

    const handleOrderCancel = (id) => {
        const removeFromPending = async () => {
            try {
                await axios({
                    method: 'POST',
                    url: '/cart',
                    data: { user: data._id, item: id, operation: 'removePending' }
                });
                dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));

            } catch (err) {
                setOpen(true);
            }
        }
        removeFromPending();
    }
    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    const [paymentMode, setPaymentMode] = useState({});
    const handleChange = (e, id) => {
        const value = e.target.value;
        setPaymentMode(prev => ({
            ...prev,
            [id]: value
        }))
    }

    if (!userProfile.login) {
        return (
            <div>
                <h1>Login to access the orders page</h1>
            </div>
        )
    }
    return (
        <div id={styles.ordersContainer}>
            <AlertComponent message='Something went wrong' operation='warning' open={open} changeOpen={changeOpen} />
            {data.pendingOrders.length ? <Alert className={styles.alert} severity="info">Pending orders</Alert> : <Alert className={styles.alert} severity="info">No pending orders</Alert>}
            {data.pendingOrders.slice().reverse().map((order, index) => {
                return (
                    <div id={styles.pendingOrder} key={index}>

                        <div className={styles.itemImage}>
                            <img src={order.paths[0]} alt={data.title} />
                        </div>
                        <div className={styles.pricing}>
                            <div className={styles.price}>
                                <span>Total</span>
                                <div>
                                    <span>&#8377;{order.discountedPrice} x {order.quantity}</span>
                                    <span>&#8377;{order.discountedPrice * order.quantity}</span>
                                </div>
                            </div>

                            <InputLabel id="paymentMode">Payment Mode</InputLabel>
                            <Select
                                labelId="paymentMode"
                                value={paymentMode[order._id] || "Cash on delivery"}
                                onChange={(e) => handleChange(e, order._id)}
                            >
                                <MenuItem value={"Cash on delivery"}>Cash on delivery</MenuItem>
                                <MenuItem value={"Net banking"}>Net banking</MenuItem>
                                <MenuItem value={"Upi"}>Upi</MenuItem>
                            </Select>
                        </div>
                        <div className={styles.itemInfo}>
                            <span>{order.title}</span>
                            <span>{order.description.length > 250 ? order.description.substr(0, 250) + '...' : order.description}</span>
                        </div>
                        <div id={styles.buttonContainer}>
                            <Button onClick={() => handleOrder(order)} color="primary" variant="outlined" size="large" startIcon={<Payment />}>Place order</Button>
                            <Button onClick={() => handleOrderCancel(order._id)} color="secondary" variant="outlined" size="large" startIcon={<Cancel />}>Cancel order</Button>
                        </div>

                    </div>
                )
            })}
            {data.orders.length ? <Alert className={styles.alert} severity="success">Order history</Alert> : <Alert className={styles.alert} severity="info">No order history</Alert>}
            {data.orders.slice().reverse().map((order, index) => {
                return (
                    <div id={styles.orderHistory} key={index}>
                        <div className={styles.itemImage}>
                            <img src={order.paths[0]} alt={data.title} />
                        </div>
                        <div className={styles.pricing}>
                            <div className={styles.price}>
                                <span>Paid</span>
                                <div>
                                    <span>&#8377;{order.discountedPrice} x {order.quantity}</span>
                                    <span>&#8377;{order.discountedPrice * order.quantity}</span>
                                </div>
                            </div>
                            <div id={styles.paymentMode}>
                                <span>Payment mode</span>
                                <span>{order.paymentMode}</span>
                            </div>
                        </div>
                        <div className={styles.itemInfo} id={styles.orderlistInfo}>
                            <span>{order.title}</span>
                            <span>{order.description.length > 250 ? order.description.substr(0, 250) + '...' : order.description}</span>
                        </div>
                        <div id={styles.orderInfo}>
                            <div id={styles.orderDate}>
                                <span>{order.orderTime}</span>
                                <span>{order.orderDate}</span>
                            </div>
                            <div id={styles.userAddress}>
                                <span>Delivery address</span>
                                <span>{data.userAddress}</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
