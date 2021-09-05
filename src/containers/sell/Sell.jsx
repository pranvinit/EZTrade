import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import styles from './sell.module.css';
//redux specific
import { useSelector, useDispatch } from 'react-redux';
//importing utils
import AlertComponent from '../../utils/AlertComponent';
//form specific
import { Button, IconButton, ButtonGroup } from '@material-ui/core';
import { AccountCircle, AddBox, PhotoCamera, AddCircleOutline, RemoveCircleOutline, ExitToApp, DeleteOutline, Save } from '@material-ui/icons';
import axios from 'axios';
import moment from 'moment';

//importing presentational components
import Items from '../../components/items/Items'

//importing logout action creator
import { sellerLogout } from '../sellerAccount/sellerAccountSlice';

export default function Sell() {
    const sellerProfile = useSelector((state) => state.sellerAccount);
    const sellerData = sellerProfile.data;
    const history = useHistory();
    const dispatch = useDispatch();
    const [formInput, setFormInput] = useState({});
    const [fileCount, setFileCount] = useState(0);

    const handleChange = ({ target }) => {
        const { name, value } = target;
        if (target.type == 'number') {
            setFormInput((prev) => ({
                ...prev,
                [name]: Number(value)
            }))
        }
        else {
            setFormInput((prev) => ({
                ...prev,
                [name]: value
            }))
        }

    }

    const handleGenderClick = ({ currentTarget }) => {
        setFormInput((prev) => ({
            ...prev,
            category: currentTarget.value
        }))
    }

    const handleFileChange = ({ target }) => {
        const fileArray = Array.from(target.files)

        setFormInput((prev) => ({
            ...prev,
            files: fileArray
        }))
        setFileCount(fileArray.length)
    }

    const [response, setResponse] = useState({})

    const handleError = (error) => {
        if (error.status == 400) {
            setResponse(prev => ({
                ...prev,
                operation: 'warning',
                message: 'Invalid file format'
            }))
        }
        else if (error.status == 500) {
            setResponse(prev => ({
                ...prev,
                operation: 'warning',
                message: 'Internal server error'
            }))
        }
        setOpen(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0)
        const date = moment().format("MMM Do YY");
        const data = new FormData();
        data.append('date', date)
        Object.entries(formInput).map(item => {
            return data.append(item[0], item[1])
        })
        if (!formInput.operation) {
            Object.entries(sellerData).map(info => {
                if (info[0] === '_id') {
                    return data.append('sellerId', info[1])
                } else {
                    return data.append(info[0], info[1])
                }
            })
        }
        if (formInput.files) {
            formInput.files.forEach(file => data.append('files', file));
        }
        const addItem = async () => {
            try {
                const response = await axios({
                    method: 'POST',
                    url: '/addItem',
                    data: data
                });
                setResponse(prev => ({
                    ...prev,
                    operation: 'success',
                    message: response.data.message
                }))
                setOpen(true)
                fetchSellerPosts()
            }
            catch (err) {
                handleError(err.response)
            }

        }
        setFormInput({})
        setFileCount(0)
        addItem()
    }

    const handleSellerLogout = () => {
        localStorage.removeItem('sellerJwtToken');
        sessionStorage.removeItem('sellerTempAuth');
        dispatch(sellerLogout());
        history.push('/')
    }

    const [sellerItems, setSellerItems] = useState([])
    const isMounted = useRef(false)
    const fetchSellerPosts = async () => {
        try {
            const response = await axios({
                method: 'POST',
                url: '/sellerItems',
                data: { id: sellerData._id }
            });
            if (isMounted.current) {
                setSellerItems(response.data)
            }
        } catch (err) {
            handleError(err.response)
        }
    }
    // handing edit and delete options
    useEffect(() => {
        isMounted.current = true
        fetchSellerPosts()
        return () => isMounted.current = false;
    }, [])

    //for admin options
    const editItem = (data) => {
        setShowForm(true);
        window.scrollTo(0, 0);
        setFormInput(prev => ({
            ...prev,
            ...data,
            operation: 'edit'
        }))
    }

    //delete alert
    const [show, setShow] = useState(false);
    const [delAlert, setDelAlert] = useState(false);
    const changeDelAlert = () => {
        setDelAlert(false);
        setShow(false);
    }
    const deleteItem = (operation, message) => {
        window.scrollTo(0, 0);
        fetchSellerPosts()
        if (operation) {
            setResponse(prev => ({
                ...prev,
                operation: 'success',
                message: message
            }))
        } else {
            setResponse(prev => ({
                ...prev,
                operation: 'warning',
                message: 'Internal server error'
            }))
        }
        setShow(true);
        setDelAlert(true);
    }

    //add item form
    const addItemForm = useRef();

    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    const [showForm, setShowForm] = useState(false);
    const handleCancel = () => {
        setFileCount(0);
        setFormInput({});
        setShowForm(false);
    }


    if (sellerProfile.hasFetched) {
        return (
            <div id={styles.mainContainer}>
                <div id={styles.sellerInfoContainer}>
                    <span id={styles.sellerGreeting}>Welcome back {sellerData.sellerName}</span>
                    <div id={styles.sellerOptions}>
                        <Button onClick={handleSellerLogout} variant="contained" color="secondary" startIcon={<ExitToApp />}>Logout</Button>
                        <Button variant="contained" color="primary" size="large" startIcon={<AccountCircle />}>show your info</Button>
                        <Button onClick={() => showForm ? setShowForm(false) : setShowForm(true)} variant="contained" color="secondary" size="large" startIcon={!showForm ? <AddBox /> : <RemoveCircleOutline />}>{!showForm ? 'Add item' : 'Hide form'}</Button>
                    </div>
                    {show && <div id={styles.deleteAlert}>
                        <AlertComponent message={response.message} operation={response.operation} open={delAlert} changeOpen={changeDelAlert} />
                    </div>}
                </div>
                {showForm && <div id={styles.formContainer}>
                    <AlertComponent message={response.message} operation={response.operation} open={open} changeOpen={changeOpen} />
                    <form ref={addItemForm} action="#" id={styles.addItemForm} onSubmit={handleSubmit}>
                        <span id={styles.signUpHeading}>Fill the form to add a new item</span>
                        <input className={styles.productTitle} type="text" name="title" onChange={handleChange} value={formInput.title || ''} placeholder="Product title" maxLength="100" required />
                        <textarea className={styles.productDesc} type="text" name="description" onChange={handleChange} value={formInput.description || ''} placeholder="Product description" required />
                        <ButtonGroup variant="text" className={styles.productCat} size="large" color="secondary" aria-label="outlined primary button group">
                            <Button onClick={handleGenderClick} value="pantry" disabled={formInput.category === 'pantry'}>Pantry</Button>
                            <Button onClick={handleGenderClick} value="clothing" disabled={formInput.category === 'clothing'}>clothing</Button>
                            <Button onClick={handleGenderClick} value="electronics" disabled={formInput.category === 'electronics'}>Electronics</Button>
                            <Button onClick={handleGenderClick} value="food" disabled={formInput.category === 'food'}>Food</Button>
                            <Button onClick={handleGenderClick} value="jwellery" disabled={formInput.category === 'jwellery'}>Jwellery</Button>
                            <Button onClick={handleGenderClick} value="other" disabled={formInput.category === 'other'}>Other</Button>
                        </ButtonGroup>
                        <div className={styles.pricing}>
                            <input className={styles.price} type="number" name="price" onChange={handleChange} value={formInput.price || ''} placeholder="Price" min="0" step="10" required />
                            <input className={styles.discountedPrice} type="number" name="discountedPrice" onChange={handleChange} value={formInput.discountedPrice || ''} placeholder="Discounted price" min="0" step="10" required />
                        </div>
                        <div>
                            <input className={styles.fileInput} id="icon-button-file" type="file" name="images" onChange={handleFileChange} placeholder="Product images" multiple />
                            <label htmlFor="icon-button-file">
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                            {!fileCount && !formInput.paths ? <span className={styles.fileCount} style={{ color: "#DB4437" }} >required</span> : <span className={styles.fileCount}>{fileCount ? fileCount : formInput.paths.length} images selected</span>}
                        </div>
                        <textarea className={styles.productDetails} type="text" name="details" onChange={handleChange} value={formInput.details || ''} placeholder="Product details" required />
                        <div className={styles.formActions} >
                            <Button size="large" startIcon={<DeleteOutline style={{ color: 'white' }} />} variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
                            <Button size="large" startIcon={!formInput.operation ? <AddCircleOutline style={{ color: 'white' }} /> : <Save style={{ color: 'white' }} />} variant="contained" color="primary" type="submit">{!formInput.operation ? 'Add item' : 'Update item'}</Button>
                        </div>
                    </form>
                </div>}
                {sellerItems.length !== 0 ? <span className={styles.sellerItemsHeading}>{sellerItems.length} Items listed</span> : <span className={styles.sellerItemsHeading}>No items listed</span>}
                {sellerItems.length !== 0 && <Items items={sellerItems} seller={true} editItem={editItem} deleteItem={deleteItem} />}
            </div>
        )
    } else {
        return (
            <div className={styles.centered}>
                <span>Login to access orders</span>
            </div>
        )
    }

}
